const express = require('express');
const invoiceRouter = express.Router();
const invoiceService = require('./invoice-service');
const retainerService = require('../retainer/retainer-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const dayjs = require('dayjs');

/**
 * Gets all invoices
 */
invoiceRouter
  .route('/all')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID });
    const userAccountID = Number(sanitizedFields.accountID);

    const invoices = await invoiceService.getAllInvoices(db, userAccountID);

    res.send({
      invoices,
      status: 200
    });
  });

/**
 * Gets all invoices for a specific company
 */
invoiceRouter
  .route('/companyInvoices')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, companyID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID, companyID });
    const sanitizedAccountID = Number(sanitizedFields.accountID);
    const sanitizedCompanyID = Number(sanitizedFields.companyID);

    const companyInvoices = await invoiceService.getCompanyInvoices(db, sanitizedAccountID, sanitizedCompanyID);

    res.send({
      companyInvoices,
      status: 200
    });
  });

/**
 * Outstanding Invoices
 */
invoiceRouter
  .route('/outstandingInvoices')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, companyID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID, companyID });
    const sanitizedAccountID = Number(sanitizedFields.accountID);
    const sanitizedCompanyID = Number(sanitizedFields.companyID);

    const outstandingCompanyInvoices = await invoiceService.getOutstandingCompanyInvoices(db, sanitizedAccountID, sanitizedCompanyID);

    res.send({
      outstandingCompanyInvoices,
      status: 200
    });
  });

/**
 * Gets Transactions for an Invoice
 */
invoiceRouter
  .route('/invoiceDetail')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, companyID, invoiceNumber } = req.body;

    const sanitizedFields = sanitizeFields({ accountID, companyID, invoiceNumber });
    const sanitizedAccountID = Number(sanitizedFields.accountID);
    const sanitizedCompanyID = Number(sanitizedFields.companyID);
    const sanitizedInvoiceNumber = Number(sanitizedFields.invoiceNumber);

    const invoiceWithTransactions = await invoiceService.getTransactionsOnCompanyInvoice(
      db,
      sanitizedAccountID,
      sanitizedCompanyID,
      sanitizedInvoiceNumber
    );

    const retainerSnapshots = await retainerService.getRetainerSnapshotsForInvoice(
      db,
      sanitizedAccountID,
      sanitizedCompanyID,
      sanitizedInvoiceNumber
    );

    const outstandingInvoiceSnapshots = await invoiceService.getOutstandingInvoiceSnapshotsOnInvoice(
      db,
      sanitizedAccountID,
      sanitizedCompanyID,
      sanitizedInvoiceNumber
    );

    const allInvoiceItemsJoined = [...invoiceWithTransactions, ...retainerSnapshots, ...outstandingInvoiceSnapshots];

    res.send({
      invoiceWithTransactions,
      retainerSnapshots,
      outstandingInvoiceSnapshots,
      allInvoiceItemsJoined,
      status: 200
    });
  });

invoiceRouter
  .route('/deleteAnInvoice')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, invoiceNumber } = req.body;

    const sanitizedFields = sanitizeFields({ accountID, invoiceNumber });

    const sanitizedAccountID = Number(sanitizedFields.accountID);
    const sanitizedInvoiceNumber = Number(sanitizedFields.invoiceNumber);

    // ToDo - Will need a way to update and put back amounts on the retainer table.

    // Delete invoice number from transactions- Should update multiple transactions w/o looping.
    await invoiceService.updateTransactionInvoiceNumbers(db, 0, accountID, invoiceNumber);

    // Delete Transaction Snapshots
    await invoiceService.deleteTransactionSnapshots(db, sanitizedAccountID, sanitizedInvoiceNumber);

    // Delete invoice retainer snapshots
    await invoiceService.deleteInvoiceRetainerSnapshots(db, sanitizedAccountID, sanitizedInvoiceNumber);

    // Delete outstanding invoice snapshots
    await invoiceService.deleteOutstandingInvoiceSnapshots(db, sanitizedAccountID, sanitizedInvoiceNumber);

    // Delete invoice
    await invoiceService.deleteInvoice(db, sanitizedAccountID, sanitizedInvoiceNumber);

    // Delete invoice details
    await invoiceService.deleteInvoiceDetail(db, sanitizedAccountID, sanitizedInvoiceNumber);

    // Get all invoices to update the UI
    const invoices = await invoiceService.getAllInvoices(db, sanitizedAccountID);

    res.send({
      invoices,
      status: 200
    });
  });

module.exports = invoiceRouter;
