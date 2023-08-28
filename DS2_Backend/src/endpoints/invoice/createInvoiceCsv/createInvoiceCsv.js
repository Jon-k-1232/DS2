const config = require('../../../../config');
const dayjs = require('dayjs');
const fs = require('fs').promises;

/**
 * Create Csv Data
 * @param {*} invoicesWithDetail
 * @param {*} accountBillingInformation
 */
const createCsvData = async (invoicesWithDetail, accountBillingInformation) => {
   const accountName = accountBillingInformation.account_name.replace(/[^a-zA-Z0-9]/g, '_');
   const now = dayjs().format('MM-DD-YYYY_T_HH_mm_ss');
   const fileLocation = `${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/CSV_Reports/${now}`;

   // Create directory
   await fs.mkdir(fileLocation, { recursive: true });

   const csvData = convertToCSV(invoicesWithDetail);

   // Write to a CSV file
   try {
      await fs.writeFile(`${fileLocation}/Invoices_Report.csv`, csvData);
      return `${fileLocation}/Invoices_Report.csv`;
   } catch (err) {
      console.error('Error writing CSV file', err);
      throw new Error('Error writing CSV file');
   }
};

/**
 * Create Rows and Columns
 * @param {*} invoicesWithDetail
 * @returns
 */
const convertToCSV = invoicesWithDetail => {
   const headers = [
      'Customer ID',
      'Customer Name',
      'Beginning Balance',
      'Payment Total',
      'Transactions Total',
      'Write Off Total',
      'Retainer Total',
      'Invoice Total',
      'Hold',
      'Send',
      'Mail',
      'Email',
      'Add Note To Invoice',
      'Adjustment Amount',
      'Adjustment Reason'
   ];
   const rows = invoicesWithDetail.map(customer => [
      customer.customer_id,
      customer.customerContactInformation.display_name,
      customer.outstandingInvoices.outstandingInvoiceTotal,
      customer.payments.paymentTotal,
      customer.transactions.transactionsTotal,
      customer.writeOffs.writeOffTotal,
      customer.retainers.retainerTotal,
      customer.invoiceTotal
   ]);

   rows.unshift(headers);
   const csvRows = rows.map(row => row.join(','));
   return csvRows.join('\n');
};

module.exports = { createCsvData };
