/**
 * Calculate the total of the invoice and remaining retainer
 * @param {*} outstandingInvoices
 * @param {*} payments
 * @param {*} transactions
 * @param {*} writeOffs
 * @param {*} retainers
 * @returns
 */
const calculateInvoiceTotals = (outstandingInvoices, payments, transactions, writeOffs, retainers) => {
  const outstandingTotal = outstandingInvoices?.outstandingBalanceBeforePayments ?? 0;
  const paymentTotal = payments?.paymentTotal ?? 0;
  const transactionTotal = transactions?.transactionTotals ?? 0;
  const writeOffTotal = writeOffs?.totalWriteOffs ?? 0;
  const retainerTotal = retainers?.retainerTotal ?? 0;

  // Find total of invoice w/o retainer
  const invoice = outstandingTotal + paymentTotal + transactionTotal + writeOffTotal;
  // Find remaining retainer
  const remainingRetainer = retainerTotal + invoice < 0 ? retainerTotal + invoice : 0;
  // Find total of invoice w/ retainer
  const invoiceTotal = remainingRetainer < 0 ? 0.0 : invoice + retainerTotal;

  return { remainingRetainer, invoiceTotal };
};

module.exports = { calculateInvoiceTotals };
