const invoiceService = require('../invoice-service');
const customerService = require('../../customer/customer-service');
const transactionsService = require('../../transactions/transactions-service');
const retainerService = require('../../retainer/retainer-service');
const { groupByFunction, findMostRecentOutstandingInvoiceRecords } = require('../sharedInvoiceFunctions');
const dayjs = require('dayjs');

/**
 * Orchestrate the invoice eligibility page
 * @param {*} db
 * @param {*} accountID
 * @returns {}
 */
const findCustomersNeedingInvoices = async (db, accountID) => {
  const [customers, invoices, transactions, retainers] = await fetchData(db, accountID);
  const [invoicesByCustomer, transactionsByCustomer, retainersByCustomer] = groupDataByCustomerId([invoices, transactions, retainers]);
  return invoiceEligibilityPerCustomer(customers, invoicesByCustomer, transactionsByCustomer, retainersByCustomer);
};

module.exports = { findCustomersNeedingInvoices };

// Fetch all data needed for the invoice eligibility page
const fetchData = async (db, accountID) => {
  return Promise.all([
    customerService.getActiveCustomers(db, accountID),
    invoiceService.getInvoices(db, accountID),
    transactionsService.getActiveTransactions(db, accountID),
    retainerService.getActiveRetainers(db, accountID)
  ]);
};

// Group the data by customer_id
const groupDataByCustomerId = data => {
  return data.map(dataset => groupByFunction(dataset, 'customer_id'));
};

const invoiceEligibilityPerCustomer = (customers, invoicesByCustomer, transactionsByCustomer, retainersByCustomer) => {
  return customers
    .map(customer => {
      const { customer_id } = customer;
      const customerInvoices = invoicesByCustomer[customer_id] || [];
      const sortedCustomerInvoices = customerInvoices.sort((a, b) => dayjs(b.invoice_date).isAfter(dayjs(a.invoice_date)));
      const outstandingInvoices = sortedCustomerInvoices && findMostRecentOutstandingInvoiceRecords(sortedCustomerInvoices);
      const mostRecentInvoice = sortedCustomerInvoices && sortedCustomerInvoices.find(invoice => invoice.parent_invoice_id === null);

      const customerTransactions = transactionsByCustomer[customer_id] || [];
      const recentCustomerTransactions =
        customerTransactions &&
        customerTransactions?.filter(transaction => dayjs(transaction.transaction_date).isAfter(dayjs(mostRecentInvoice.invoice_date)));

      const customerRetainers = retainersByCustomer[customer_id] || [];
      const customerActiveRetainers = customerRetainers && customerRetainers?.filter(retainer => Number(retainer.current_amount) < 0);

      if (!customerActiveRetainers.length && !recentCustomerTransactions.length && !outstandingInvoices.length) {
        return null;
      }

      return {
        ...customer,
        retainer_count: customerActiveRetainers.length,
        transaction_count: recentCustomerTransactions.length,
        invoice_count: outstandingInvoices.length
      };
    })
    .filter(Boolean); // Removes null entries
};
