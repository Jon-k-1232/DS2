const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const transactionsRouter = express.Router();
const transactionsService = require('./transactions-service');
const jobService = require('../job/job-service');
const { restoreDataTypesTransactionsTableOnCreate, restoreDataTypesTransactionsTableOnUpdate } = require('./transactionsObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { unableToCompleteRequest } = require('../../serverResponses/errors');

// Create a new transaction
transactionsRouter.route('/createTransaction/:accountID/:userID').post(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  try {
    const sanitizedNewTransaction = sanitizeFields(req.body.transaction);

    // Create new object with sanitized fields
    const transactionTableFields = restoreDataTypesTransactionsTableOnCreate(sanitizedNewTransaction);
    const { total_transaction, customer_job_id, account_id } = transactionTableFields;

    // Update job total
    await updateRecentJobTotal(db, customer_job_id, account_id, total_transaction);

    // Post new transaction
    await transactionsService.createTransaction(db, transactionTableFields);
    await sendUpdatedTableWith200Response(db, res, account_id);
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while creating the transaction.',
      status: 500
    });
  }
});

// Update a transaction
transactionsRouter.route('/updateTransaction/:accountID/:userID').put(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  try {
    const sanitizedUpdatedTransaction = sanitizeFields(req.body.transaction);

    // Create new object with sanitized fields
    const transactionTableFields = restoreDataTypesTransactionsTableOnUpdate(sanitizedUpdatedTransaction);
    const { account_id, customer_job_id, customer_invoice_id } = transactionTableFields;

    // If transaction is attached to an invoice, do not allow update
    if (customer_invoice_id) {
      const reason = 'Transaction is attached to an invoice and cannot be updated.';
      unableToCompleteRequest(res, reason, 423);
      return;
    }

    // Get original transaction and decide if a positive or negative change in order to update the job record
    const changeJobTotal = await differenceBetweenOldAndNewTransaction(db, transactionTableFields);
    const { areAmountsDifferent, amountToChangeJob } = changeJobTotal;

    // Update job total
    if (areAmountsDifferent) {
      await updateRecentJobTotal(db, customer_job_id, account_id, amountToChangeJob);
    }

    // Update transaction
    await transactionsService.updateTransaction(db, transactionTableFields);

    await sendUpdatedTableWith200Response(db, res, account_id);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message || 'An error occurred while updating the transaction.',
      status: 500
    });
  }
});

// Delete a transaction
transactionsRouter.route('/deleteTransaction/:accountID/:userID').delete(async (req, res) => {
  const db = req.app.get('db');

  try {
    const sanitizedUpdatedTransaction = sanitizeFields(req.body.transaction);

    // Create new object with sanitized fields
    const transactionTableFields = restoreDataTypesTransactionsTableOnUpdate(sanitizedUpdatedTransaction);
    const { customer_job_id, transaction_id, account_id, customer_invoice_id } = transactionTableFields;

    // If transaction is attached to an invoice, do not allow delete
    if (customer_invoice_id) {
      const reason = 'Transaction is attached to an invoice and cannot be deleted.';
      unableToCompleteRequest(res, reason, 423);
      return;
    }

    // Get original transaction and decide if a positive or negative change in order to update the job record
    const changeJobTotal = await differenceBetweenOldAndNewTransaction(db, transactionTableFields, 'delete');
    const { amountToChangeJob } = changeJobTotal;

    // Update job total
    await updateRecentJobTotal(db, customer_job_id, account_id, amountToChangeJob);

    // Delete transaction
    await transactionsService.deleteTransaction(db, transaction_id);
    await sendUpdatedTableWith200Response(db, res, account_id);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message || 'An error occurred while deleting the transaction.',
      status: 500
    });
  }
});

// Get a specific transaction
transactionsRouter
  .route('/getSingleTransaction/:customerID/:transactionID/:accountID/:userID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { customerID, transactionID, accountID } = req.params;

    // Get specific transaction
    const transactionData = await transactionsService.getSingleTransaction(db, accountID, customerID, transactionID);

    const activeTransactionsData = {
      transactionData,
      grid: createGrid(transactionData)
    };

    res.send({
      activeTransactionsData,
      message: 'Successfully retrieved specific transaction.',
      status: 200
    });
  });

module.exports = transactionsRouter;

/**
 * Find if the amounts are different between the original and updated transaction and the difference amount
 * @param {*} db
 * @param {*} transactionTableFields
 * @returns
 */
const differenceBetweenOldAndNewTransaction = async (db, transactionTableFields, aggregationType) => {
  const { account_id, customer_id, transaction_id } = transactionTableFields;
  // Get original transaction and decide if a positive or negative change in order to update the job record
  const [originalTransaction] = await transactionsService.getSingleTransaction(db, account_id, customer_id, transaction_id);
  const originalTransactionTotal = Number(originalTransaction?.total_transaction);
  const updatedTransactionTotal = Number(transactionTableFields?.total_transaction);
  const amountToChangeJob =
    aggregationType !== 'delete' ? updatedTransactionTotal - originalTransactionTotal : -Math.abs(originalTransactionTotal);
  const areAmountsDifferent = originalTransactionTotal !== updatedTransactionTotal;
  return { areAmountsDifferent, amountToChangeJob };
};

/**
 * Find the most recent job and update the job total
 * @param {*} db
 * @param {*} customerJobID
 * @param {*} accountID
 * @param {*} amountToChangeJob
 */
const updateRecentJobTotal = async (db, customerJobID, accountID, amountToChangeJob) => {
  const recentJob = await jobService.getRecentJob(db, customerJobID, accountID);
  const { current_job_total, parent_job_id } = recentJob;
  const updatedJobAmount = Number(current_job_total) + Number(amountToChangeJob);
  const parentJobID = !parent_job_id ? customerJobID : parent_job_id;
  const updatedJob = { ...recentJob, parent_job_id: parentJobID, current_job_total: updatedJobAmount };

  // Post new Job record
  await jobService.createJob(db, updatedJob);
};

const sendUpdatedTableWith200Response = async (db, res, accountID) => {
  // Get all transactions
  const activeTransactions = await transactionsService.getActiveTransactions(db, accountID);

  const activeTransactionsData = {
    activeTransactions,
    grid: createGrid(activeTransactions)
  };

  res.send({
    transactionsList: { activeTransactionsData },
    message: 'Successfully deleted transaction.',
    status: 200
  });
};
