const { createNewInvoiceObject, calculateRemainingRetainer, newPaymentObject } = require('../../invoiceObjects');
const invoiceService = require('../../invoice-service');

/**
 * Orchestrates the posting data upon invoice creation.
 * @param {*} db
 * @param {*} invoice Object with properties
 * @param {*} userID - integer
 */
const insertInvoiceIntoDatabase = async (db, invoice, userID) => {
  // Create new invoice
  const newInvoiceObject = createNewInvoiceObject(invoice, userID);
  const returnedInvoice = await invoiceService.postNewInvoice(db, newInvoiceObject);
  const invoiceReference = returnedInvoice.customer_invoice_id;

  // Update retainer, payments, write-offs, and transactions
  await updateRetainers(db, invoice);
  await updatePayments(db, invoice, invoiceReference);
  await createNewPaymentsForUsedRetainers(db, invoice, invoiceReference, userID);
  await updateWriteOffs(db, invoice, invoiceReference);
  await updateTransactions(db, invoice, invoiceReference);
};

module.exports = { insertInvoiceIntoDatabase };

const updateRetainers = async (db, invoice) => {
  const updatedRetainerObject = calculateRemainingRetainer(invoice);
  await Promise.all(updatedRetainerObject.map(async retainer => invoiceService.updateRetainer(db, retainer)));
};

const updatePayments = async (db, invoice, invoiceReference) => {
  await Promise.all(invoice.payments.paymentRecords.map(async record => invoiceService.updatePayments(db, record, invoiceReference)));
};

const createNewPaymentsForUsedRetainers = async (db, invoice, invoiceReference, userID) => {
  const updatedRetainerObject = calculateRemainingRetainer(invoice);
  await Promise.all(
    updatedRetainerObject.map(async retainer => {
      if (retainer.retainer_amount_used >= 0) return {};
      const paymentObject = newPaymentObject(retainer, invoiceReference, userID);
      return retainer.retainer_amount_used < 0 && invoiceService.postNewPayment(db, paymentObject);
    })
  );
};

const updateWriteOffs = async (db, invoice, invoiceReference) => {
  await Promise.all(invoice.writeOffs.writeOffs.map(async record => invoiceService.updateWriteOff(db, record, invoiceReference)));
};

const updateTransactions = async (db, invoice, invoiceReference) => {
  await Promise.all(
    Object.values(invoice.transactions.jobs).map(async job =>
      Promise.all(job.transactions.map(async transaction => invoiceService.updateTransactions(db, transaction, invoiceReference)))
    )
  );
};
