const dayjs = require('dayjs');

const groupAndTotalOutstandingInvoices = (customer_id, invoiceQueryData) => {
   const customerOutstandingInvoices = invoiceQueryData.customerOutstandingInvoices[customer_id] || [];
   const customersLastInvoiceDate = invoiceQueryData.lastInvoiceDateByCustomerID[customer_id] || [];

   const outstandingInvoiceRecords = filterInvoices(customerOutstandingInvoices, customersLastInvoiceDate);
   const outstandingInvoiceTotal = outstandingInvoiceRecords.reduce((prev, invoice) => (prev += Number(invoice.remaining_balance_on_invoice)), 0);

   if (isNaN(outstandingInvoiceTotal)) {
      console.log(`Outstanding Invoice Total on customerID:${customer_id} is NaN`);
      throw new Error(`Outstanding Invoice Total on customerID:${customer_id} is NaN`);
   }
   if (outstandingInvoiceTotal === null || outstandingInvoiceTotal === undefined) {
      console.log(`Outstanding Invoice Total on customerID:${customer_id} is null or undefined`);
      throw new Error(`Outstanding Invoice Total on customerID:${customer_id} is null or undefined`);
   }
   if (typeof outstandingInvoiceTotal !== 'number') {
      console.log(`Outstanding Invoice Total on customerID:${customer_id} is not a number`);
      throw new Error(`Outstanding Invoice Total on customerID:${customer_id} is not a number`);
   }

   return { outstandingInvoiceTotal, outstandingInvoiceRecords };
};

module.exports = { groupAndTotalOutstandingInvoices };

/**
 * This function will filter the invoices into one invoice record per invoice number.
 *    - The invoice should be the most recent invoice for the customer, upto the last invoice date.
 * Calculating invoice this way to avoid matching payments to most recent invoices.
 * Requirements of the invoice group coming in:
 * Include parent invoices that do not have children and have a remaining balance.
 * Include parent invoices along with all their children where at least one of the children still has a remaining balance.
 * Include parent invoices along with all their children where a payment has been made after the last invoice date, regardless of the remaining balance.
 */
const filterInvoices = (customerOutstandingInvoices, customersLastInvoiceDate) => {
   const invoices = customerOutstandingInvoices.reduce((prev, invoice) => {
      // If invoice key does not exist, create key and initialize empty
      if (!prev[invoice.invoice_number]) prev[invoice.invoice_number] = invoice;

      const { created_at, remaining_balance_on_invoice } = invoice;

      const invoiceDateMatchesLastInvoiceDate = dayjs(created_at).isSame(dayjs(customersLastInvoiceDate));
      const invoiceDateIsBeforeLastInvoiceDate = dayjs(created_at).isBefore(dayjs(customersLastInvoiceDate));
      const invoiceDateIsGreaterThanStoredInvoiceDate = dayjs(created_at).isAfter(prev[invoice.invoice_number].created_at);

      // If the current invoice date/time matches the last invoice date/time, add the invoice to the array
      if (invoiceDateMatchesLastInvoiceDate) {
         prev[invoice.invoice_number] = invoice;
      }

      // If the current invoice date/time is before the last invoice date/time, and has a balance
      if (invoiceDateIsBeforeLastInvoiceDate && Number(remaining_balance_on_invoice) > 0) {
         prev[invoice.invoice_number] = invoice;
         // If the current invoice date/time is greater than the currently stored invoice creation date, replace the invoice
      } else if (invoiceDateIsGreaterThanStoredInvoiceDate && invoiceDateIsBeforeLastInvoiceDate) {
         prev[invoice.invoice_number] = invoice;
      }

      return prev;
   }, {});

   return Object.values(invoices);
};
