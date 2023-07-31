const express = require('express');
const path = require('path');
const fs = require('fs');
const invoiceRouter = express.Router();
const invoiceService = require('./invoice-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { findCustomersNeedingInvoices } = require('./invoiceEligibility/invoiceEligibility');
const { createGrid, filterGridByColumnName } = require('../../helperFunctions/helperFunctions');
const { createInvoices } = require('./createInvoice/createInvoicesOrchestrator');
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
    grid: filterGridByColumnName(fullGrid, [
      'customer_id',
      'business_name',
      'customer_name',
      'display_name',
      'retainer_count',
      'transaction_count',
      'invoice_count'
    ])
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

  // Sanitize fields
  const sanitizedData = sanitizeFields(req.body.invoice);

  const { createInvoicesOnCustomerIDs, isCsvOnly, showWriteOffs, isRoughDraft, isFinalized, manualInvoiceNote, loggedByUserID, accountID } =
    sanitizedData;

  // Create invoices, and provides a pass buffer for pdfs to be zipped
  const newInvoices = await createInvoices(
    db,
    accountID,
    createInvoicesOnCustomerIDs,
    isCsvOnly,
    showWriteOffs,
    isRoughDraft,
    isFinalized,
    manualInvoiceNote,
    loggedByUserID
  );

  // Get invoices including the new ones
  const activeInvoices = await invoiceService.getInvoices(db, accountID);

  // Return Object
  const activeInvoiceData = {
    activeInvoices,
    grid: createGrid(activeInvoices)
  };

  // Zips PDFs, and provides a passthrough zip
  const zipFile = await createZip(newInvoices);
  // Save zip to disk and returns the path for which it saved
  const zipPath = await saveZipToDisk(zipFile, accountID);

  res.send({
    newInvoices,
    zipPath,
    invoicesList: { activeInvoiceData },
    message: 'Successfully retrieved balance.',
    status: 200
  });
});

// ToDo - will need re written to not delete, but we will point to S3 bucket, its like this for dev purposes
invoiceRouter.route('/getZippedInvoices/:accountID/:userID').get(async (req, res) => {
  const { filename } = req.query;

  // Find zip file in the file system
  const zipFilePath = path.join(filename);

  // Check if the file exists
  fs.access(zipFilePath, fs.constants.F_OK, err => {
    if (err) {
      console.error(err);
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // Set the headers to trigger the file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send the file to the client for download
    res.download(path.resolve(zipFilePath), err => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error downloading file' });
      } else {
        // Delete the file from the file system after it has been downloaded
        fs.unlink(zipFilePath, err => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }
    });
  });
});

module.exports = invoiceRouter;
