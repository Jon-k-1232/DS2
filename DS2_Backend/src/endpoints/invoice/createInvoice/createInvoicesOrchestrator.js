const { fetchInitialQueryItems } = require('./createInvoiceData/createInvoiceQueries');
const { incrementAnInvoiceOrQuote } = require('../sharedInvoiceFunctions');
const { createPDF } = require('../../../pdfCreator/templateOne/templateOneOrchestrator');
const dayjs = require('dayjs');
const { groupAndTotalInvoices } = require('./invoiceCalculationsAndGroupings/beginningBalanceCalculationAndGrouping');
const { groupAndTotalPayments } = require('./invoiceCalculationsAndGroupings/paymentsCalculationsAndGrouping');
const { groupAndTotalTransactions } = require('./invoiceCalculationsAndGroupings/transactionCalculationAndGrouping');
const { getTotalWriteoffAmount } = require('./invoiceCalculationsAndGroupings/writeOffsCalculationAndGrouping');
const { getTotalRetainerAmount } = require('./invoiceCalculationsAndGroupings/retainerCalculation');
const { calculateInvoiceTotals } = require('./invoiceCalculationsAndGroupings/calculateInvoiceTotal');
const { insertInvoiceIntoDatabase } = require('./createInvoiceData/createInvoicePostData');

const createInvoices = async (db, accountID, customerIDs, csvOnly, showWriteOffs, roughDraftInvoice, lockInvoice, notes, userID) => {
  const initialData = await fetchInitialQueryItems(db, customerIDs, accountID);

  return Promise.all(
    customerIDs.map(async (customerID, i) => {
      const invoice = createInvoiceData(customerID, i, initialData, notes);
      let pdfBuffer = null;

      if (csvOnly) {
        // ToDo Create CSV
      }

      if (lockInvoice) {
        // ToDo insert
        // await insertInvoiceIntoDatabase(db, invoice, userID);
      }

      if (roughDraftInvoice || lockInvoice) pdfBuffer = await createPDF(invoice);

      // pdfBuffer is for the pdf to be passed through, rather than saved to fs
      return { ...invoice, pdfBuffer };
    })
  );
};

module.exports = { createInvoices };

/**
 * Totals and groups the invoice data, creating an invoice object, and returns it
 * @param {*} customerID - int
 * @param {*} i - int
 * @param {*} initialData - object
 * @param {*} notes - string ''
 * @returns {Object} - returns invoice object
 */
const createInvoiceData = (customerID, i, initialData, notes) => {
  const { accountPayToInfo, nextAccountInvoiceNumber, customerLastInvoiceDates, customerData, allInvoices } = initialData;
  const { customerContactInformation, paymentData, transactionData, writeOffData, retainerData } = customerData[customerID];
  const lastInvoiceDate = customerLastInvoiceDates[customerID];
  const customerInvoices = allInvoices[customerID];

  const invoiceData = {
    dueDate: dayjs().add(16, 'days').format('MM/DD/YYYY'),
    customerContactInfo: customerContactInformation[0],
    invoiceNote: notes ? notes[customerID] : '',
    incrementedNextInvoiceNumber: incrementAnInvoiceOrQuote(nextAccountInvoiceNumber, i),
    outstandingInvoices: customerInvoices && groupAndTotalInvoices(customerInvoices, lastInvoiceDate),
    payments: paymentData && groupAndTotalPayments(paymentData),
    transactions: transactionData && groupAndTotalTransactions(transactionData),
    writeOffs: writeOffData && getTotalWriteoffAmount(writeOffData),
    retainers: retainerData && getTotalRetainerAmount(retainerData),
    accountPayToInfo: accountPayToInfo
  };

  const invoiceTotals = calculateInvoiceTotals(
    invoiceData.outstandingInvoices,
    invoiceData.payments,
    invoiceData.transactions,
    invoiceData.writeOffs,
    invoiceData.retainers
  );

  return { ...invoiceData, ...invoiceTotals };
};
