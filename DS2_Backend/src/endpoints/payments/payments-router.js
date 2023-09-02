const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const paymentsRouter = express.Router();
const paymentsService = require('./payments-service');
const invoiceService = require('../invoice/invoice-service');
const retainersService = require('../retainer/retainer-service');
const { restoreDataTypesPaymentsTableOnCreate, restoreDataTypesPaymentsTableOnUpdate } = require('./paymentsObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { unableToCompleteRequest } = require('../../serverResponses/errors');

// Create a new payment
paymentsRouter.route('/createPayment/:accountID/:userID').post(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   try {
      const sanitizedNewPayment = sanitizeFields(req.body.payment);
      const paymentTableFields = restoreDataTypesPaymentsTableOnCreate(sanitizedNewPayment);

      const { customer_invoice_id, account_id, payment_amount } = paymentTableFields;

      if (!customer_invoice_id) {
         throw new Error('No invoice ID provided for this payment.');
      }

      // Find all records for this invoice
      const [matchingInvoice] = await invoiceService.getInvoiceByInvoiceRowID(db, account_id, customer_invoice_id);
      const { remaining_balance_on_invoice } = matchingInvoice || {};

      // If no matching invoice return error
      if (!Object.keys(matchingInvoice).length) {
         throw new Error('No matching invoice record found for this payment.');
      }

      // return error for over payment, along with the max amount that can be applied to this invoice
      if (Math.abs(remaining_balance_on_invoice) < Math.abs(payment_amount)) {
         throw new Error(`Payment amount exceeds remaining balance on invoice. Max amount that can be applied to this invoice is $${Math.abs(remaining_balance_on_invoice)}.`);
      }

      // Calculate remaining balance, and post
      await handlePaymentMatchingInvoice(db, matchingInvoice, paymentTableFields);

      return returnTablesWithSuccessResponse(db, res, paymentTableFields);
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'An error occurred while creating the Payment.',
         status: 500
      });
   }
});

// Get single payment
paymentsRouter
   .route('/getSinglePayment/:paymentID/:accountID/:userID')
   // .all( requireAuth )
   .get(async (req, res) => {
      const db = req.app.get('db');
      try {
         const { paymentID, accountID } = req.params;

         const activePayments = await paymentsService.getSinglePayment(db, paymentID, accountID);

         if (!activePayments.length) throw new Error('No matching payment record found.');

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
      } catch (err) {
         console.log(err);
         res.send({
            message: err.message || 'An error occurred while updating the Payment.',
            status: 500
         });
      }
   });

// Update a payment
paymentsRouter.route('/updatePayment/:accountID/:userID').put(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   try {
      const sanitizedUpdatedPayment = sanitizeFields(req.body.payment);

      // Create new object with sanitized fields
      const paymentTableFields = restoreDataTypesPaymentsTableOnUpdate(sanitizedUpdatedPayment);
      const { customer_invoice_id } = paymentTableFields;

      // If payment is attached to an invoice, do not allow update
      if (customer_invoice_id) {
         throw new Error('Payment is attached to an invoice and cannot be updated.');
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
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'An error occurred while updating the Payment.',
         status: 500
      });
   }
});

// Delete a payment
paymentsRouter.route('/deletePayment/:accountID/:userID').delete(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   try {
      const sanitizedUpdatedPayment = sanitizeFields(req.body.payment);

      // Create new object with sanitized fields
      const paymentTableFields = restoreDataTypesPaymentsTableOnUpdate(sanitizedUpdatedPayment);
      const { customer_invoice_id, payment_id, account_id } = paymentTableFields;

      // If payment is attached to an invoice, do not allow delete
      if (customer_invoice_id) {
         throw new Error('Payment is attached to an invoice and cannot be deleted.');
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
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'An error occurred while deleting the Payment.',
         status: 500
      });
   }
});

module.exports = paymentsRouter;

/**
 *
 * @param {*} db
 * @param {*} matchingInvoice
 * @param {*} paymentTableFields
 * @param {*} outstandingInvoices
 */
const handlePaymentMatchingInvoice = async (db, matchingInvoice, paymentTableFields) => {
   const { remaining_balance_on_invoice = 0, customer_invoice_id } = matchingInvoice;
   const paymentAmount = Number(paymentTableFields.payment_amount);
   const remainingBalance = Number(remaining_balance_on_invoice);

   let remainingAmount;
   let invoiceInsertionObject = createInvoiceObject(matchingInvoice, null, customer_invoice_id);
   let paymentObject = paymentTableFields;

   if (remainingBalance === paymentAmount) {
      remainingAmount = paymentAmount;
   } else if (remainingBalance > paymentAmount) {
      remainingAmount = remainingBalance + paymentAmount;
      invoiceInsertionObject = createInvoiceObject(matchingInvoice, remainingAmount, customer_invoice_id);
   }

   await Promise.all([paymentsService.createPayment(db, paymentObject), invoiceService.createInvoice(db, invoiceInsertionObject)]);
};

/**
 * Send back all tables with success response
 * @param {*} db
 * @param {*} res
 * @param {*} paymentTableFields
 */
const returnTablesWithSuccessResponse = async (db, res, paymentTableFields) => {
   const { account_id } = paymentTableFields;

   const [activePayments, activeRetainers] = await Promise.all([paymentsService.getActivePayments(db, account_id), retainersService.getActiveRetainers(db, account_id)]);

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
 * Makes invoice object for insertion into invoice table
 * @param {*} matchingInvoice
 * @param {*} remainingAmount- int, not required - if provided, this amount will be used as the remaining balance
 * @returns
 */
const createInvoiceObject = (matchingInvoice, remainingAmount, customerInvoiceID) => {
   const { parent_invoice_id } = matchingInvoice;

   delete matchingInvoice.customer_invoice_id;

   return {
      ...matchingInvoice,
      parent_invoice_id: parent_invoice_id > 0 ? parent_invoice_id : customerInvoiceID,
      remaining_balance_on_invoice: remainingAmount || 0,
      is_invoice_paid_in_full: remainingAmount === 0 ? true : false,
      fully_paid_date: remainingAmount === 0 ? new Date() : null,
      created_at: new Date()
   };
};
