const { groupAndTotalPayments } = require('./invoiceCalculations/paymentsCalculations');
const { groupAndTotalRetainers } = require('./invoiceCalculations/retainerCalculations');
const { groupAndTotalWriteOffs } = require('./invoiceCalculations/writeOffCalculations');
const { groupAndTotalTransactions } = require('./invoiceCalculations/transactionCalculations');
const { groupAndTotalOutstandingInvoices } = require('./invoiceCalculations/outstandingInvoicesCalculations');
const { totalInvoice } = require('./invoiceCalculations/totalInvoice');

const calculateInvoices = (invoicesToCreate, invoiceQueryData) => {
   return invoicesToCreate.map(customer => {
      const { customer_id, showWriteOffs } = customer;
      const hideRetainers = false;

      const invoiceInformation = {
         payments: groupAndTotalPayments(customer_id, invoiceQueryData),
         retainers: groupAndTotalRetainers(customer_id, invoiceQueryData, hideRetainers),
         writeOffs: groupAndTotalWriteOffs(customer_id, invoiceQueryData, showWriteOffs),
         transactions: groupAndTotalTransactions(customer_id, invoiceQueryData, showWriteOffs),
         outstandingInvoices: groupAndTotalOutstandingInvoices(customer_id, invoiceQueryData)
      };

      const invoiceTotal = totalInvoice(invoiceInformation, showWriteOffs, hideRetainers);

      // const autoPayments = groupAndTotalAutoPayments(customer_id, invoiceQueryData);
      return { customer_id, ...invoiceInformation, invoiceTotal };
   });
};

module.exports = { calculateInvoices };
