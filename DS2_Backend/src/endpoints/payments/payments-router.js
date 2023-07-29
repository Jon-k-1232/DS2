const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const paymentsRouter = express.Router();
const paymentsService = require('./payments-service');
const invoiceService = require('../invoice/invoice-service');
const retainersService = require('../retainer/retainer-service');
const { restoreDataTypesPaymentsTableOnCreate, restoreDataTypesPaymentsTableOnUpdate } = require('./paymentsObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { unableToCompleteRequest } = require('../../serverResponses/errors');
const { findMostRecentOutstandingInvoiceRecords } = require('../invoice/sharedInvoiceFunctions');

// Create a new payment
paymentsRouter.route('/createPayment/:accountID/:userID').post(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const paymentTableFields = createPaymentTableFields(req.body.payment);

  const { customer_invoice_id, account_id, customer_id, payment_amount } = paymentTableFields;
  const invoices = await invoiceService.getCustomerInvoiceByID(db, account_id, customer_id);
  const outstandingInvoices = findMostRecentOutstandingInvoiceRecords(invoices);

  if (outstandingInvoices.length === 0) {
    await handleExcessPayment(db, res, paymentTableFields);
    return returnTablesWithSuccessResponse(db, res, paymentTableFields);
  }

  if (!customer_invoice_id) {
    await distributePaymentThroughOutstandingInvoices(db, paymentTableFields, outstandingInvoices);
    return returnTablesWithSuccessResponse(db, res, paymentTableFields);
  }

  const matchingInvoice = outstandingInvoices.find(invoice => invoice.customer_invoice_id === customer_invoice_id);

  if (!matchingInvoice) {
    distributePaymentThroughOutstandingInvoices(db, paymentTableFields, outstandingInvoices);
  } else {
    await handlePaymentMatchingInvoice(db, matchingInvoice, paymentTableFields, outstandingInvoices);
  }

  return returnTablesWithSuccessResponse(db, res, paymentTableFields);
});

// Get all active payments
paymentsRouter
  .route('/getActivePayments/:accountID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;

    const activePayments = await paymentsService.getActivePayments(db, accountID);

    // Return Object
    const activePaymentsData = {
      activePayments,
      grid: createGrid(activePayments)
    };

    res.send({
      activePaymentsData,
      message: 'Successfully retrieved all active payments.',
      status: 200
    });
  });

// Get single payment
paymentsRouter
  .route('/getSinglePayment/:paymentID/:accountID/:userID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { paymentID, accountID } = req.params;

    const activePayments = await paymentsService.getSinglePayment(db, paymentID, accountID);

    // Return Object
    const activePaymentData = {
      activePayments,
      grid: createGrid(activePayments)
    };

    res.send({
      activePaymentData,
      message: 'Successfully retrieved single payment.',
      status: 200
    });
  });

// Update a payment
paymentsRouter
  .route('/updatePayment/:accountID/:userID')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedUpdatedPayment = sanitizeFields(req.body.payment);

    // Create new object with sanitized fields
    const paymentTableFields = restoreDataTypesPaymentsTableOnUpdate(sanitizedUpdatedPayment);
    const { customer_invoice_id } = paymentTableFields;

    // If payment is attached to an invoice, do not allow update
    if (customer_invoice_id) {
      const reason = 'Payment is attached to an invoice and cannot be updated.';
      unableToCompleteRequest(res, reason, 423);
      return;
    }

    // Update payment
    await paymentsService.updatePayment(db, paymentTableFields);

    // Get all payments
    const activePayments = await paymentsService.getActivePayments(db, paymentTableFields.account_id);

    const activePaymentsData = {
      activePayments,
      grid: createGrid(activePayments)
    };

    res.send({
      paymentsList: { activePaymentsData },
      message: 'Successfully updated payment.',
      status: 200
    });
  });

// Delete a payment
paymentsRouter
  .route('/deletePayment/:accountID/:userID')
  // .all(requireAuth)
  .delete(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedUpdatedPayment = sanitizeFields(req.body.payment);

    // Create new object with sanitized fields
    const paymentTableFields = restoreDataTypesPaymentsTableOnUpdate(sanitizedUpdatedPayment);
    const { customer_invoice_id, payment_id, account_id } = paymentTableFields;

    // If payment is attached to an invoice, do not allow delete
    if (customer_invoice_id) {
      const reason = 'Payment is attached to an invoice and cannot be deleted.';
      unableToCompleteRequest(res, reason, 423);
      return;
    }

    // Delete payment
    await paymentsService.deletePayment(db, payment_id);

    // Get all payments
    const paymentsData = await paymentsService.getActivePayments(db, account_id);

    const activePaymentsData = {
      paymentsData,
      grid: createGrid(paymentsData)
    };

    res.send({
      paymentsList: { activePaymentsData },
      message: 'Successfully deleted payment.',
      status: 200
    });
  });

module.exports = paymentsRouter;

const createPaymentTableFields = paymentData => {
  const sanitizedNewPayment = sanitizeFields(paymentData);
  return restoreDataTypesPaymentsTableOnCreate(sanitizedNewPayment);
};

const handlePaymentMatchingInvoice = async (db, matchingInvoice, paymentTableFields, outstandingInvoices) => {
  const { remaining_balance_on_invoice = 0 } = matchingInvoice;
  const paymentAmount = Number(paymentTableFields.payment_amount);
  const remainingBalance = Number(remaining_balance_on_invoice);

  let remainingAmount;
  let invoiceInsertionObject = createInvoiceObject(matchingInvoice);
  let paymentObject = paymentTableFields;

  const balanceEqualsPayment = remainingBalance === paymentAmount;
  const balanceGreaterThanPayment = remainingBalance > paymentAmount;
  const balanceLessThanPayment = remainingBalance < paymentAmount;

  if (balanceEqualsPayment) {
    remainingAmount = paymentAmount;
  } else if (balanceGreaterThanPayment) {
    remainingAmount = remainingBalance + paymentAmount;
    invoiceInsertionObject = createInvoiceObject(matchingInvoice, remainingAmount);
  } else if (balanceLessThanPayment) {
    remainingAmount = paymentAmount + remainingBalance;
    paymentObject = createPaymentsAndRetainersObject(paymentTableFields, remainingAmount);
    await distributePaymentThroughOutstandingInvoices(db, paymentTableFields, outstandingInvoices, matchingInvoice);
  }

  await Promise.all([paymentsService.createPayment(db, paymentObject), invoiceService.createInvoice(db, invoiceInsertionObject)]);
};

/**
 * from a single payment, iterates through outstanding invoices applying as much payment as possible to each invoice
 * @param {*} db
 * @param {*} payment
 * @param {*} invoices
 * @param {*} ignoredInvoice - Object, Not required - if provided, this invoice will be ignored when distributing the payment
 * @returns
 */
const distributePaymentThroughOutstandingInvoices = async (db, payment, invoices, ignoredInvoice = null) => {
  const paymentDistributions = await invoices.reduce(async (prevPromise, invoice) => {
    const distributions = await prevPromise;

    if (payment.payment_amount >= 0 || (ignoredInvoice && invoice.customer_invoice_id === ignoredInvoice.customer_invoice_id)) {
      return distributions;
    }

    const amountToPay = Math.max(payment.payment_amount, -invoice.remaining_balance_on_invoice);
    payment.payment_amount -= amountToPay;
    invoice.remaining_balance_on_invoice += amountToPay;

    const invoiceInsertionObject = createInvoiceObject(invoice, invoice.remaining_balance_on_invoice);
    const paymentTableFields = { ...payment, customer_invoice_id: invoice.customer_invoice_id, payment_amount: amountToPay };

    await Promise.all([paymentsService.createPayment(db, paymentTableFields), invoiceService.createInvoice(db, invoiceInsertionObject)]);

    distributions.push({ invoiceId: invoice.customer_invoice_id, amountPaid: amountToPay });

    return distributions;
  }, Promise.resolve([]));

  // If there's any remaining payment, add it to the retainer/prepayment table
  if (payment.payment_amount < 0) {
    const retainerInsertionObject = createPaymentsAndRetainersObject(payment, payment.payment_amount);
    await retainersService.createRetainer(db, retainerInsertionObject);
  }

  return paymentDistributions;
};

/**
 * Handles the excess payment, creates retainer/Prepayment object,and inserts into retainer/Prepayment table.
 * @param {*} db
 * @param {*} res
 * @param {*} paymentTableFields
 * @param {*} remainingAmount
 */
const handleExcessPayment = async (db, res, paymentTableFields, remainingAmount) => {
  // create object for payment and retainers insert
  const paymentsAndRetainersObject = createPaymentsAndRetainersObject(paymentTableFields, remainingAmount);
  // insert into payments and retainers
  await retainersService.createRetainer(db, paymentsAndRetainersObject);
};

/**
 * Send back all tables with success response
 * @param {*} db
 * @param {*} res
 * @param {*} paymentTableFields
 */
const returnTablesWithSuccessResponse = async (db, res, paymentTableFields) => {
  const { account_id } = paymentTableFields;

  const [activePayments, activeRetainers] = await Promise.all([
    paymentsService.getActivePayments(db, account_id),
    retainersService.getActiveRetainers(db, account_id)
  ]);

  const activePaymentsData = {
    activePayments,
    grid: createGrid(activePayments)
  };

  const activeRetainerData = {
    activeRetainers,
    grid: createGrid(activeRetainers)
  };

  res.send({
    paymentsList: { activePaymentsData },
    accountRetainersList: { activeRetainerData },
    message: 'Successfully created new payment.',
    status: 200
  });
};

/**
 * Create Object for Payments and Retainers table
 * @param {*} paymentTableFields
 * @param {*} remainingAmount - int, not required - if provided, this amount will be used as the starting and current amount
 * @returns
 */
const createPaymentsAndRetainersObject = (paymentTableFields, remainingAmount) => {
  const { account_id, customer_id, form_of_payment, payment_reference_number, created_by_user_id, payment_amount } = paymentTableFields;
  return {
    parent_retainer_id: null,
    customer_id,
    account_id,
    type_of_hold: 'Prepayment',
    starting_amount: remainingAmount || payment_amount,
    current_amount: remainingAmount || payment_amount,
    form_of_payment,
    payment_reference_number,
    is_retainer_active: true,
    created_by_user_id,
    note: 'No Invoices existed for this payment. Record has been generated.'
  };
};

/**
 * Makes invoice object for insertion into invoice table
 * @param {*} matchingInvoice
 * @param {*} remainingAmount- int, not required - if provided, this amount will be used as the remaining balance
 * @returns
 */
const createInvoiceObject = (matchingInvoice, remainingAmount) => {
  const { customer_invoice_id, parent_invoice_id, remaining_balance_on_invoice, is_invoice_paid_in_full, fully_paid_date, created_at } =
    matchingInvoice;
  return {
    ...matchingInvoice,
    parent_invoice_id: parent_invoice_id ? parent_invoice_id : customer_invoice_id,
    remaining_balance_on_invoice: remainingAmount || 0,
    is_invoice_paid_in_full: true,
    fully_paid_date: new Date(),
    created_at: new Date()
  };
};
