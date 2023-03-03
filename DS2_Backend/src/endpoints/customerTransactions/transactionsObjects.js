const dayjs = require('dayjs');

/**
 * Restores Data types after sanitization
 * @param {*} cleanedFields
 * @returns Object with restored data types
 */
const restoreDataTypes = cleanedFields => ({
  accountID: Number(cleanedFields.accountID),
  customerID: Number(cleanedFields.customerID),
  customerJobID: Number(cleanedFields.customerJobID),
  accountEmployeeID: Number(cleanedFields.accountEmployeeID),
  invoiceNumber: Number(cleanedFields.invoiceNumber),
  transactionType: cleanedFields.transactionType,
  transactionDate: dayjs(cleanedFields.transactionDate).format(),
  quantity: Number(cleanedFields.quantity),
  unitOfMeasure: cleanedFields.unitOfMeasure,
  unitCost: Number(cleanedFields.unitCost),
  totalTransaction: Number(cleanedFields.totalTransaction),
  isTransactionBillable: Boolean(cleanedFields.isTransactionBillable)
});

module.exports = { restoreDataTypes };
