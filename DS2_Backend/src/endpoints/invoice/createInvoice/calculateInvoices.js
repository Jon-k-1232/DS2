const { groupAndTotalPayments } = require('./invoiceCalculations/paymentsCalculations');
const { groupAndTotalRetainers } = require('./invoiceCalculations/retainerCalculations');
const { groupAndTotalWriteOffs } = require('./invoiceCalculations/writeOffCalculations');
const { incrementAnInvoiceOrQuote } = require('../sharedInvoiceFunctions');
const { groupAndTotalTransactions } = require('./invoiceCalculations/transactionCalculations');
const { groupAndTotalOutstandingInvoices } = require('./invoiceCalculations/outstandingInvoicesCalculations');

const calculateInvoices = (invoicesToCreate, invoiceQueryData) => {
   return invoicesToCreate.map((customer, i) => {
      const { customer_id, showWriteOffs } = customer;
      const { lastInvoiceNumber, customerInformation } = invoiceQueryData;
      const startingInvoiceNumber = lastInvoiceNumber?.invoice_number || 'INV-2023-00000';

      const customerContactInformation = customerInformation[customer_id];
      const invoiceNumber = incrementAnInvoiceOrQuote(startingInvoiceNumber, i);
      const payments = groupAndTotalPayments(customer_id, invoiceQueryData);
      const retainers = groupAndTotalRetainers(customer_id, invoiceQueryData);
      const writeOffs = groupAndTotalWriteOffs(customer_id, invoiceQueryData, showWriteOffs);
      const transactions = groupAndTotalTransactions(customer_id, invoiceQueryData, showWriteOffs);
      const outstandingInvoices = groupAndTotalOutstandingInvoices(customer_id, invoiceQueryData);

      // const autoPayments = groupAndTotalAutoPayments(customer_id, invoiceQueryData);
      // const invoiceTotal = groupAndTotalWholeInvoice(customer_id, invoiceQueryData);

      // todo - handle invoice object creation
      // todo - adjustments

      return { invoiceNumber, retainers, customerContactInformation, payments, writeOffs, transactions, outstandingInvoices };
   });
};

module.exports = { calculateInvoices };
