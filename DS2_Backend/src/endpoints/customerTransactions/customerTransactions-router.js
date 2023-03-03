const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const customerTransactionsRouter = express.Router();
const transactionService = require('./customerTransactions-service');
const { restoreDataTypes } = require('./transactionsObjects');

/**
 * Get all transactions
 */
customerTransactionsRouter
  .route('/allCustomerTransactions')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID });
    const sanitizedAccountID = Number(sanitizedFields.accountID);

    const allCustomerTransactions = await transactionService.getAllTransactions(db, sanitizedAccountID);

    res.send({
      allCustomerTransactions,
      status: 200
    });
  });

/**
 * Get all customer transactions
 */
customerTransactionsRouter
  .route('/customerTransactions')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { customerID, accountID } = req.body;

    const sanitizedFields = sanitizeFields({ customerID, accountID });
    const sanitizedCustomerID = Number(sanitizedFields.customerID);
    const sanitizedAccountID = Number(sanitizedFields.accountID);

    const customerTransactions = await transactionService.getCustomerTransactions(db, sanitizedAccountID, sanitizedCustomerID);

    res.send({
      customerTransactions,
      status: 200
    });
  });

/**
 * Get all customer transactions - job
 */
customerTransactionsRouter
  .route('/jobTransactions/:companyId/:jobId/')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { customerID, accountID, jobID } = req.body;

    const sanitizedFields = sanitizeFields({ customerID, accountID, jobID });
    const sanitizedCustomerID = Number(sanitizedFields.customerID);
    const sanitizedAccountID = Number(sanitizedFields.accountID);
    const sanitizedJobID = Number(sanitizedFields.jobID);

    const jobTransactions = await transactionService.getTransactionsForCustomerJobs(
      db,
      sanitizedCustomerID,
      sanitizedAccountID,
      sanitizedJobID
    );

    res.send({
      jobTransactions,
      status: 200
    });
  });

/**
 * Add a new transaction
 */
customerTransactionsRouter
  .route('/newTransaction')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const {
      accountID,
      customerID,
      customerJobID,
      accountEmployeeID,
      invoiceNumber,
      transactionType,
      transactionDate,
      quantity,
      unitOfMeasure,
      unitCost,
      totalTransaction,
      isTransactionBillable
    } = req.body;

    const cleanedFields = sanitizeFields({
      accountID,
      customerID,
      customerJobID,
      accountEmployeeID,
      invoiceNumber,
      transactionType,
      transactionDate,
      quantity,
      unitOfMeasure,
      unitCost,
      totalTransaction,
      isTransactionBillable
    });

    const sanitizedWithDataTypes = restoreDataTypes(cleanedFields);
    const sanitizedAccountID = sanitizedWithDataTypes.accountID;

    const newTransaction = await transactionService.insertNewTransaction(db, sanitizedWithDataTypes);
    const allCustomerTransactions = await transactionService.getAllTransactions(db, sanitizedAccountID);

    res.send({
      newTransaction,
      allCustomerTransactions,
      message: 'Transaction added',
      status: 200
    });
  });

/** Deletes Transaction */
customerTransactionsRouter
  .route('/deleteTransaction')
  .all(requireAuth)
  .delete(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { accountID, customerTransactionID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID, customerTransactionID });

    const sanitizedAccountID = Number(sanitizedFields.accountID);
    const sanitizedCustomerTransactionID = Number(sanitizedFields.customerTransactionID);

    const deletedTransaction = await transactionService.deleteTransaction(db, sanitizedAccountID, sanitizedCustomerTransactionID);
    const allCustomerTransactions = await transactionService.getAllTransactions(db, sanitizedAccountID);

    res.send({
      deletedTransaction,
      allCustomerTransactions,
      message: 'Transaction deleted',
      status: 200
    });
  });

module.exports = customerTransactionsRouter;
