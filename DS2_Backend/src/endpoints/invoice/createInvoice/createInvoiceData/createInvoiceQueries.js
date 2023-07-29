const customerService = require('../../../customer/customer-service');
const invoiceService = require('../../invoice-service');
const { groupByFunction, stringValueMap, incrementAnInvoiceOrQuote } = require('../../sharedInvoiceFunctions');

/**
 * Fetches data specific to clients, and after the last invoice date.
 * @param {*} db
 * @param {*} accountID
 * @param {*} customerID
 * @param {*} lastInvoiceDate
 * @returns {Object}
 */
const fetchCustomerDataForID = async (db, accountID, customerID, lastInvoiceDate) => {
  const customerInformation = await customerService.getContactMailingInformation(db, accountID, customerID);
  const customerPayments = await invoiceService.getPaymentsForCustomer(db, accountID, customerID, lastInvoiceDate);
  const customerWriteOffs = await invoiceService.getWriteOffsForArrayOfCustomers(db, accountID, customerID, lastInvoiceDate);
  const customerTransactions = await invoiceService.getTransactionsForArrayOfCustomers(db, accountID, customerID, lastInvoiceDate);
  const customerRetainers = await invoiceService.getRetainersForArrayOfCustomers(db, accountID, customerID);

  const invoiceRecipientDisplayName = customerInformation[0].business_name || customerInformation[0].customer_name;
  customerInformation[0].invoiceRecipientName = invoiceRecipientDisplayName;

  return {
    customerContactInformation: [...customerInformation],
    paymentData: [...customerPayments],
    transactionData: [...customerTransactions],
    writeOffData: [...customerWriteOffs],
    retainerData: [...customerRetainers]
  };
};

/**
 * fetches data specific to customer and last invoice date
 * @param {*} db
 * @param {*} accountID
 * @param {*} customerIDs
 * @param {*} customerLastInvoiceDates
 * @returns  {Object}
 */
const fetchCustomerData = async (db, accountID, customerIDs, customerLastInvoiceDates) => {
  const results = await Promise.all(
    customerIDs.map(async customerID => {
      const lastInvoiceDate = customerLastInvoiceDates[customerID];
      const customerData = await fetchCustomerDataForID(db, accountID, customerID, lastInvoiceDate);
      return { [customerID]: customerData };
    })
  );

  // Combine the results into a single object
  return Object.assign({}, ...results);
};

/**
 * Orchestrator to fetch initial data for all clients with outstanding invoices.
 * @param {*} db
 * @param {*} customerIDs
 * @param {*} accountID
 * @returns
 */
const fetchInitialQueryItems = async (db, customerIDs, accountID) => {
  const [accountPayToInfo, lastInvoiceNumberInDb, customerLastInvoiceDatesInDB, invoicesData] = await Promise.all([
    invoiceService.getAccountPayToInfo(db, accountID),
    invoiceService.getLastInvoiceNumberInDB(db, accountID),
    invoiceService.customersLastInvoiceDate(db, accountID, customerIDs),
    invoiceService.getInvoicesForArrayOfCustomers(db, accountID, customerIDs)
  ]);

  const nextAccountInvoiceNumber = incrementAnInvoiceOrQuote(lastInvoiceNumberInDb);
  const customerLastInvoiceDates = stringValueMap(customerLastInvoiceDatesInDB, 'customer_id');

  const activeInvoices = invoicesData.filter(
    invoice => invoice.fully_paid_date > customerLastInvoiceDates[invoice.customer_id] || !invoice.fully_paid_date
  );
  const allInvoices = groupByFunction(activeInvoices, 'customer_id');

  const customerData = await fetchCustomerData(db, accountID, customerIDs, customerLastInvoiceDates);

  return {
    accountPayToInfo,
    nextAccountInvoiceNumber,
    customerLastInvoiceDates,
    customerData,
    allInvoices
  };
};

module.exports = { fetchInitialQueryItems };
