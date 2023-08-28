const { groupAndTotalPayments } = require('./paymentsCalculations');
const { groupAndTotalRetainers } = require('./retainerCalculations');
const { groupAndTotalWriteOffs } = require('./writeOffCalculations');
const { groupAndTotalTransactions } = require('./transactionCalculations');
const { groupAndTotalOutstandingInvoices } = require('./outstandingInvoicesCalculations');
const { totalInvoice } = require('./totalInvoice');

const calculateInvoices = (invoicesToCreate, invoiceQueryData) => {
   try {
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

         // Todo - const autoPayments = groupAndTotalAutoPayments(customer_id, invoiceQueryData);
         return { customer_id, ...invoiceInformation, invoiceTotal };
      });
   } catch (error) {
      console.log(`Error Calculating Invoices: ${error.message}`);
      throw new Error('Error calculating invoices: ' + error.message);
   }
};

module.exports = { calculateInvoices };
