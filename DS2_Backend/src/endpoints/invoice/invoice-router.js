const express = require('express');
const path = require('path');
const fs = require('fs');
const invoiceRouter = express.Router();
const invoiceService = require('./invoice-service');
const accountService = require('../account/account-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { findCustomersNeedingInvoices } = require('./invoiceEligibility/invoiceEligibility');
const { createGrid, filterGridByColumnName } = require('../../helperFunctions/helperFunctions');
const { fetchInitialQueryItems } = require('./createInvoice/createInvoiceQueries');
const { calculateInvoices } = require('./createInvoice/invoiceCalculations/calculateInvoices');
const { addInvoiceDetails } = require('./createInvoice/addDetailToInvoice/addInvoiceDetail');
const { createAndSavePdfsToDisk } = require('../../pdfCreator/createAndSavePDFs');
const { createCsvData } = require('./createInvoiceCsv/createInvoiceCsv');
const config = require('../../../config');

// GET all invoices
invoiceRouter.route('/getInvoices/:accountID/:invoiceID').get(async (req, res) => {
   const db = req.app.get('db');
   const { accountID } = req.params;

   const activeInvoices = await invoiceService.getInvoices(db, accountID);

   // Return Object
   const activeInvoiceData = {
      activeInvoices,
      grid: createGrid(activeInvoices)
   };

   res.send({
      activeInvoiceData,
      message: 'Successfully retrieved invoices.',
      status: 200
   });
});

// Delete invoice
invoiceRouter.route('/deleteInvoice/:accountID/:invoiceID').delete(async (req, res) => {
   const db = req.app.get('db');
   const { accountID, invoiceID } = req.params;

   await invoiceService.deleteInvoice(db, invoiceID);

   const invoicesData = await invoiceService.getInvoices(db, accountID);

   // Create Mui Grid
   const grid = createGrid(invoicesData);

   // Return Object
   const invoices = {
      invoicesData,
      grid
   };

   res.send({
      invoices,
      message: 'Successfully deleted invoice.',
      status: 200
   });
});

// Update an invoice
invoiceRouter.route('/updateInvoice').put(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   // sanitize fields
   const sanitizedInvoice = sanitizeFields(req.body.invoice);

   // Create new object with sanitized fields
   const invoiceTableFields = restoreDataTypesInvoiceTableOnUpdate(sanitizedInvoice);

   // Update invoice
   await invoiceService.updateInvoice(db, invoiceTableFields);

   const invoicesData = await invoiceService.getInvoices(db, invoiceTableFields.account_id);

   // Create Mui Grid
   const grid = createGrid(invoicesData);

   // Return Object
   const invoices = {
      invoicesData,
      grid
   };

   res.send({
      invoices,
      message: 'Successfully updated invoice.',
      status: 200
   });
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

      let pdfFileLocation = '';
      let csvFileLocation = '';

      if (isCsvOnly) {
         csvFileLocation = await createCsvData(invoicesWithDetail, accountBillingInformation);
      }

      if (isRoughDraft) {
         pdfFileLocation = await createAndSavePdfsToDisk(invoicesWithDetail, isFinalized, accountBillingInformation);
      }

      if (isFinalized) {
         pdfFileLocation = await createAndSavePdfsToDisk(invoicesWithDetail, isFinalized, accountBillingInformation);
         // Handle data inserts
         // await handleDataInserts(db, invoicesWithDetail, accountID, userID);
      }

      res.send({
         invoicesWithDetail,
         csvFileLocation,
         pdfFileLocation,
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

module.exports = invoiceRouter;
