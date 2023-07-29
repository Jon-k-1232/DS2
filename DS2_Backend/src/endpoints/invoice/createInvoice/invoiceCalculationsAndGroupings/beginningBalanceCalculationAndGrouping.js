const createInvoiceRecord = (invoice, totalCharges) => ({
  invoiceNumber: invoice.invoice_number,
  invoiceDate: invoice.invoice_date,
  lastPaymentDate: null,
  invoiceBeginningBalance: totalCharges,
  invoiceOutstandingBalanceToday: 0,
  invoiceBalanceDisplay: 0,
  invoiceCurrentBillingCyclePayments: 0,
  totalPayments: 0,
  paymentRecords: [],
  invoiceRecord: { ...invoice }
});

const processPayment = (invoice, output) => {
  const id = invoice.customer_invoice_id;
  const paymentAmount = parseFloat(invoice.payment_amount || 0);

  if (invoice['payment_date'] !== null) {
    output.invoiceRecords[id].paymentRecords.push({ ...invoice });
    output.invoiceRecords[id].totalPayments += paymentAmount;
    output.totalPayments += paymentAmount;

    const paymentDate = new Date(invoice['payment_date']);
    if (output.invoiceRecords[id].lastPaymentDate === null || paymentDate > output.invoiceRecords[id].lastPaymentDate) {
      output.invoiceRecords[id].lastPaymentDate = paymentDate;
    }
  }
};

const calculateInvoiceOutstandingBalances = (record, lastInvoiceDate) => {
  const paymentDate = record.lastPaymentDate;
  record.invoiceOutstandingBalanceToday = parseFloat(record.invoiceBeginningBalance) + record.totalPayments;

  record.invoiceBalanceDisplay =
    paymentDate !== null && lastInvoiceDate <= paymentDate
      ? record.invoiceOutstandingBalanceToday + Math.abs(record.totalPayments)
      : record.invoiceOutstandingBalanceToday;

  record.invoiceCurrentBillingCyclePayments =
    paymentDate !== null && lastInvoiceDate <= paymentDate ? record.invoiceCurrentBillingCyclePayments + record.totalPayments : 0;
};

const groupAndTotalInvoices = (invoices, lastInvoiceDate) => {
  let output = {
    outstandingBalanceBeforePayments: 0,
    outstandingBalanceToday: 0,
    totalPaymentsInCurrentBillingCycle: 0,
    totalPayments: 0,
    outstandingBalanceTotalForInvoiceDisplay: 0,
    invoiceRecords: {}
  };

  invoices.forEach(invoice => {
    const id = invoice.customer_invoice_id;
    const paymentAmount = parseFloat(invoice.payment_amount || 0);
    const totalCharges = parseFloat(invoice.total_charges);

    if (!output.invoiceRecords[id]) {
      output.invoiceRecords[id] = createInvoiceRecord(invoice, totalCharges);
      output.outstandingBalanceBeforePayments += totalCharges;
    }

    processPayment(invoice, output);
  });

  output.outstandingBalanceToday = output.outstandingBalanceBeforePayments + output.totalPayments;

  Object.values(output.invoiceRecords).forEach(record => {
    calculateInvoiceOutstandingBalances(record, lastInvoiceDate);

    output.totalPaymentsInCurrentBillingCycle += record.totalPayments;
    output.outstandingBalanceTotalForInvoiceDisplay = Math.abs(output.totalPayments) + output.outstandingBalanceToday;
  });

  return output;
};

module.exports = { groupAndTotalInvoices };
