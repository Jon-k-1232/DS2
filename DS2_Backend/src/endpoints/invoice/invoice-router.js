const express = require('express');
const path = require('path');
const fs = require('fs');
const invoiceRouter = express.Router();
const invoiceService = require('./invoice-service');
const accountService = require('../account/account-service');
const transactionsService = require('../transactions/transactions-service');
const paymentsService = require('../payments/payments-service');
const writeOffsService = require('../writeOffs/writeOffs-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { findCustomersNeedingInvoices } = require('./invoiceEligibility/invoiceEligibility');
const { createGrid, filterGridByColumnName, generateTreeGridData } = require('../../helperFunctions/helperFunctions');
const { fetchInitialQueryItems } = require('./createInvoice/createInvoiceQueries');
const { calculateInvoices } = require('./createInvoice/invoiceCalculations/calculateInvoices');
const { addInvoiceDetails } = require('./createInvoice/addDetailToInvoice/addInvoiceDetail');
const { createPDFInvoices } = require('../../pdfCreator/createAndSavePDFs');
const { createCsvData } = require('./createInvoiceCsv/createInvoiceCsv');
const { createAndSaveZip } = require('../../pdfCreator/zipOrchestrator');
const dataInsertionOrchestrator = require('./invoiceDataInsertions/dataInsertionOrchestrator');
const { requireManagerOrAdmin } = require('../auth/jwt-auth');
const config = require('../../../config');

// GET all invoices
invoiceRouter.route('/getInvoices/:accountID/:invoiceID').get(async (req, res) => {
   const db = req.app.get('db');
   const { accountID } = req.params;

   const activeInvoices = await invoiceService.getInvoices(db, accountID);

   // Return Object
   const activeInvoiceData = {
      activeInvoices,
      grid: createGrid(activeInvoices),
      treeGrid: generateTreeGridData(activeInvoices, 'customer_invoice_id', 'parent_invoice_id')
   };

   res.send({
      activeInvoiceData,
      message: 'Successfully retrieved invoices.',
      status: 200
   });
});

// Delete invoice
invoiceRouter
   .route('/deleteInvoice/:accountID/:invoiceID')
   .all(requireManagerOrAdmin)
   .delete(async (req, res) => {
      const db = req.app.get('db');
      const { accountID, invoiceID } = req.params;

      try {
         // check from transactions, writeoffs, and retainers, payments, and writeoffs
         const foundTransactions = await transactionsService.getTransactionsForInvoice(db, accountID, invoiceID);
         const foundPayments = await paymentsService.getPaymentsForInvoice(db, accountID, invoiceID);
         const foundWriteoffs = await writeOffsService.getWriteoffsForInvoice(db, accountID, invoiceID);

         if (foundTransactions.length || foundPayments.length || foundWriteoffs.length) {
            throw new Error('Cannot delete invoice with transactions, retainers, payments, or writeoffs.');
         }

         await invoiceService.deleteInvoice(db, invoiceID);
         const activeInvoices = await invoiceService.getInvoices(db, accountID);

         // Return Object
         const activeInvoiceData = {
            activeInvoices,
            grid: createGrid(activeInvoices),
            treeGrid: generateTreeGridData(activeInvoices, 'customer_invoice_id', 'parent_invoice_id')
         };

         res.send({
            invoicesList: { activeInvoiceData },
            message: 'Successfully deleted invoice.',
            status: 200
         });
      } catch (error) {
         res.send({
            message: error.message || 'An error occurred while deleting the invoice.',
            status: 500
         });
      }
   });

// Get accounts with a balance to generate invoices
invoiceRouter.route('/createInvoice/AccountsWithBalance/:accountID/:invoiceID').get(async (req, res) => {
   const db = req.app.get('db');
   const { accountID } = req.params;

   const activeOutstandingBalances = await findCustomersNeedingInvoices(db, accountID);

   const fullGrid = createGrid(activeOutstandingBalances);

   // Return Object
   const activeOutstandingBalancesData = {
      activeOutstandingBalances,
      grid: filterGridByColumnName(fullGrid, ['customer_id', 'business_name', 'customer_name', 'display_name', 'retainer_count', 'transaction_count', 'invoice_count'])
   };

   res.send({
      outstandingBalanceList: { activeOutstandingBalancesData },
      message: 'Successfully retrieved balance.',
      status: 200
   });
});

// Create an invoice or multiple invoices
invoiceRouter.route('/createInvoice/:accountID/:userID').post(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   const { accountID, userID } = req.params;

   // Sanitize fields
   const sanitizedData = sanitizeFields(req.body.invoiceConfiguration);
   const { invoicesToCreate, invoiceCreationSettings } = sanitizedData;
   const { isFinalized, isRoughDraft, isCsvOnly, globalInvoiceNote } = invoiceCreationSettings;

   try {
      // Create map of customer_id and object as value. Needed later when matching calculated invoices with invoice details
      const invoicesToCreateMap = invoicesToCreate.reduce((map, obj) => ({ ...map, [obj.customer_id]: obj }), {});
      const [accountBillingInformation] = await accountService.getAccount(db, accountID);
      const invoiceQueryData = await fetchInitialQueryItems(db, invoicesToCreateMap, accountID);
      const calculatedInvoices = calculateInvoices(invoicesToCreate, invoiceQueryData);
      const invoicesWithDetail = addInvoiceDetails(calculatedInvoices, invoiceQueryData, invoicesToCreateMap, accountBillingInformation, globalInvoiceNote);

      let fileLocation = '';

      const csvBuffer = createCsvData(invoicesWithDetail);
      const pdfBuffer = await createPDFInvoices(invoicesWithDetail);
      const filesToZip = pdfBuffer.concat(csvBuffer);

      if (isCsvOnly && isRoughDraft) {
         fileLocation = await createAndSaveZip(filesToZip, accountBillingInformation, 'monthly_files/csv_report_and_draft_invoices', 'zipped_files.zip');
      } else if (isCsvOnly) {
         fileLocation = await createAndSaveZip([csvBuffer], accountBillingInformation, 'monthly_files/csv_report', 'zipped_files.zip');
      } else if (isRoughDraft) {
         fileLocation = await createAndSaveZip(pdfBuffer, accountBillingInformation, 'monthly_files/draft_invoices', 'zipped_files.zip');
      } else if (isFinalized) {
         fileLocation = await createAndSaveZip(pdfBuffer, accountBillingInformation, 'monthly_files/final_invoices', 'zipped_files.zip');
         // Insert data into db
         await dataInsertionOrchestrator(db, invoicesWithDetail, accountBillingInformation, pdfBuffer, userID);
      }

      // get invoices table data
      const activeInvoices = await invoiceService.getInvoices(db, accountID);

      // Return Object
      const activeInvoiceData = {
         activeInvoices,
         grid: createGrid(activeInvoices),
         treeGrid: generateTreeGridData(activeInvoices, 'customer_invoice_id', 'parent_invoice_id')
      };

      res.send({
         invoicesWithDetail,
         fileLocation,
         invoicesList: { activeInvoiceData },
         message: 'Successfully retrieved balance.',
         status: 200
      });
   } catch (error) {
      res.send({
         message: error.message,
         status: 500
      });
   }
});

invoiceRouter.route('/downloadFile/:accountID/:userID').get(async (req, res) => {
   try {
      const zipFilePath = req.query.fileLocation;

      // Validate file path
      if (zipFilePath === undefined || !zipFilePath || !zipFilePath.startsWith(`${config.DEFAULT_PDF_SAVE_LOCATION}`)) {
         return res.status(400).send('Invalid file path');
      }

      // Check if the file exists before attempting to download
      fs.access(zipFilePath, fs.constants.F_OK, err => {
         if (err) return res.send({ message: 'File not found', status: 400, error: err });

         // File exists, proceed with the download
         return res.status(200).download(zipFilePath, path.basename(zipFilePath), err => {
            if (err) return res.send({ message: `Couldn't download file`, status: 400, error: err });
         });
      });
   } catch (error) {
      res.send({
         message: 'Successfully retrieved balance.',
         status: 400
      });
   }
});

// fetch invoice details
invoiceRouter.route('/getInvoiceDetails/:invoiceID/:accountID/:userID').get(async (req, res) => {
   const db = req.app.get('db');
   const { accountID, invoiceID } = req.params;

   const [invoiceDetails] = await invoiceService.getInvoiceByInvoiceRowID(db, accountID, invoiceID);

   res.send({
      invoiceDetails,
      message: 'Successfully retrieved invoice details.',
      status: 200
   });
});

module.exports = invoiceRouter;
