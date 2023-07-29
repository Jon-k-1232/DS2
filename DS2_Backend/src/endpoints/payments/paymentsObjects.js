const restoreDataTypesPaymentsTableOnCreate = data => ({
  customer_id: Number(data.customerID),
  account_id: Number(data.accountID),
  customer_job_id: data.selectedJobID || null,
  retainer_id: Number(data.selectedRetainerID) || null,
  customer_invoice_id: Number(data.foundInvoiceID) || null,
  payment_date: data.transactionDate,
  payment_amount: -Math.abs(Number(data.unitCost)),
  form_of_payment: data.formOfPayment,
  payment_reference_number: data.paymentReferenceNumber || null,
  is_transaction_billable: Boolean(data.isTransactionBillable) || true,
  created_by_user_id: Number(data.loggedByUserID),
  note: data.note || null
});

const restoreDataTypesPaymentsTableOnUpdate = data => ({
  payment_id: Number(data.paymentID),
  customer_id: Number(data.customerID),
  account_id: Number(data.accountID),
  customer_job_id: data.selectedJobID || null,
  retainer_id: Number(data.selectedRetainerID) || null,
  customer_invoice_id: Number(data.foundInvoiceID) || null,
  payment_date: data.transactionDate,
  payment_amount: -Math.abs(Number(data.unitCost)),
  form_of_payment: data.formOfPayment,
  payment_reference_number: data.paymentReferenceNumber || null,
  is_transaction_billable: Boolean(data.isTransactionBillable) || true,
  created_by_user_id: Number(data.loggedByUserID),
  note: data.note || null
});

module.exports = { restoreDataTypesPaymentsTableOnCreate, restoreDataTypesPaymentsTableOnUpdate };
