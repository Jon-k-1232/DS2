const express = require('express');
const path = require('path');
const invoiceRouter = express.Router();
const invoiceService = require('./invoice-service');
const accountService = require('../account/account-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { findCustomersNeedingInvoices } = require('./invoiceEligibility/invoiceEligibility');
const { createGrid, filterGridByColumnName } = require('../../helperFunctions/helperFunctions');
const { fetchInitialQueryItems } = require('./createInvoice/createInvoiceQueries');
const { calculateInvoices } = require('./createInvoice/calculateInvoices');
const { addInvoiceDetails } = require('./createInvoice/addInvoiceDetail');
const { createAndSavePdfsToDisk } = require('../../pdfCreator/CreateAndSavePDFs');
const { createZip, saveZipToDisk } = require('../../pdfCreator/zipOrchestrator');

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

   // Create map of customer_id and object as value. Needed later when matching calculated invoices with invoice details
   const invoicesToCreateMap = invoicesToCreate.reduce((map, obj) => ({ ...map, [obj.customer_id]: obj }), {});

   const [accountBillingInformation] = await accountService.getAccount(db, accountID);
   const invoiceQueryData = await fetchInitialQueryItems(db, invoicesToCreateMap, accountID);
   const calculatedInvoices = calculateInvoices(invoicesToCreate, invoiceQueryData);
   const invoicesWithDetail = addInvoiceDetails(calculatedInvoices, invoiceQueryData, invoicesToCreateMap, accountBillingInformation, globalInvoiceNote);

   // Create PDF buffer and metadata for each invoice
   const pdfBuffer = await createAndSavePdfsToDisk(invoicesWithDetail, isFinalized);

   // Zips PDFs, and provides a passthrough zip
   //    const zipFile = await createZip(invoicesWithDetail);
   //    // Save zip to disk and returns the path for which it saved
   //    const zipPath = await saveZipToDisk(zipFile, accountID);

   res.send({
      invoicesWithDetail,
      message: 'Successfully retrieved balance.',
      status: 200
   });
});

// invoiceRouter.route('/getZippedInvoices/:accountID/:userID').get(async (req, res) => {
//   const { filename } = req.query;

//   // Find zip file in the file system
//   const zipFilePath = path.join(filename);

//   // Check if the file exists
//   fs.access(zipFilePath, fs.constants.F_OK, err => {
//     if (err) {
//       console.error(err);
//       res.status(404).json({ message: 'File not found' });
//       return;
//     }

//     // Set the headers to trigger the file download
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Type', 'application/octet-stream');

//     // Send the file to the client for download
//     res.download(path.resolve(zipFilePath), err => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error downloading file' });
//       } else {
//         // Delete the file from the file system after it has been downloaded
//         fs.unlink(zipFilePath, err => {
//           if (err) {
//             console.error('Error deleting file:', err);
//           }
//         });
//       }
//     });
//   });
// });

module.exports = invoiceRouter;
