const restoreDataTypesWriteOffsTableOnCreate = data => ({
  customer_id: Number(data.customerID),
  account_id: Number(data.accountID),
  customer_invoice_id: Number(data.customerInvoiceID) || null,
  customer_job_id: Number(data.selectedJobID) || null,
  writeoff_date: data.selectedDate,
  writeoff_amount: -Math.abs(data.unitCost),
  transaction_type: 'Writeoff',
  writeoff_reason: data.writeOffReason || null,
  created_by_user_id: Number(data.loggedByUserID),
  note: data.note || null
});

const restoreDataTypesWriteOffsTableOnUpdate = data => ({
  writeoff_id: Number(data.writeoffID),
  customer_id: Number(data.customerID),
  account_id: Number(data.accountID),
  customer_invoice_id: Number(data.customerInvoiceID) || null,
  customer_job_id: Number(data.selectedJobID) || null,
  writeoff_date: data.selectedDate,
  writeoff_amount: -Math.abs(data.unitCost),
  transaction_type: 'Writeoff',
  writeoff_reason: data.writeOffReason || null,
  created_by_user_id: Number(data.loggedByUserID),
  note: data.note || null
});

module.exports = { restoreDataTypesWriteOffsTableOnCreate, restoreDataTypesWriteOffsTableOnUpdate };
