const { incrementAnInvoiceOrQuote } = require('../../sharedInvoiceFunctions');
const fs = require('fs');
const dayjs = require('dayjs');

const addInvoiceDetails = (calculatedInvoices, invoiceQueryData, invoicesToCreateMap, accountBillingInformation, globalInvoiceNote) => {
   const filePath = accountBillingInformation?.account_company_logo;
   // Check if file exists. If not, set to N/A
   const companyLogo = fs.existsSync(filePath) ? fs.readFileSync(filePath) : 'N/A';

   return calculatedInvoices.map((invoiceCalculation, i) => {
      const { customer_id, invoiceNote } = invoicesToCreateMap[invoiceCalculation.customer_id];
      const { lastInvoiceNumber, customerInformation } = invoiceQueryData;
      const startingInvoiceNumber = lastInvoiceNumber?.invoice_number || 'INV-2023-00000';

      const customerContactInformation = customerInformation[customer_id];
      const invoiceNumber = incrementAnInvoiceOrQuote(startingInvoiceNumber, i);
      const dueDate = dayjs().add(16, 'day').format('MM/DD/YYYY');

      return { invoiceNumber, dueDate, globalInvoiceNote, invoiceNote, accountBillingInformation, customerContactInformation, companyLogo, ...invoiceCalculation };
   });
};

module.exports = { addInvoiceDetails };
