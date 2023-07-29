const restoreDataTypesTransactionsTableOnCreate = transaction => ({
  account_id: Number(transaction.accountID),
  customer_id: Number(transaction.customerID),
  customer_job_id: Number(transaction.customerJobID),
  customer_invoice_id: Number(transaction.customerInvoicesID) || null,
  logged_for_user_id: Number(transaction.loggedForUserID),
  detailed_work_description: String(transaction.detailedJobDescription) || '',
  transaction_date: String(transaction.transactionDate),
  transaction_type: String(transaction.transactionType),
  quantity: Number(transaction.quantity),
  unit_cost: Number(transaction.unitCost),
  total_transaction: Math.abs(Number(transaction.totalTransaction)),
  is_transaction_billable: Boolean(transaction.isTransactionBillable) || true,
  is_excess_to_subscription: Boolean(transaction.isInAdditionToMonthlyCharge) || false,
  created_by_user_id: Number(transaction.loggedByUserID)
});

const restoreDataTypesTransactionsTableOnUpdate = transaction => ({
  transaction_id: Number(transaction.transactionID),
  account_id: Number(transaction.accountID),
  customer_id: Number(transaction.customerID),
  customer_job_id: Number(transaction.customerJobID),
  customer_invoice_id: Number(transaction.customerInvoicesID) || null,
  logged_for_user_id: Number(transaction.loggedForUserID),
  detailed_work_description: String(transaction.detailedJobDescription) || '',
  transaction_date: String(transaction.transactionDate),
  transaction_type: String(transaction.transactionType),
  quantity: Number(transaction.quantity) || 1,
  unit_cost: Number(transaction.unitCost),
  total_transaction: Math.abs(Number(transaction.totalTransaction)),
  is_transaction_billable: Boolean(transaction.isTransactionBillable) || true,
  is_excess_to_subscription: Boolean(transaction.isInAdditionToMonthlyCharge) || false,
  created_by_user_id: Number(transaction.loggedByUserID)
});

module.exports = { restoreDataTypesTransactionsTableOnCreate, restoreDataTypesTransactionsTableOnUpdate };
