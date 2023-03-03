/**
 * Inserts a new customer
 * @param {*} customerBlob
 * @returns {Object} New customer object
 */
const formNewCustomerObject = customerBlob => ({
  accountID: Number(customerBlob.accountID),
  isCustomerActive: Boolean(customerBlob.isCustomerActive),
  isCustomerBillable: Boolean(customerBlob.isCustomerBillable),
  isCustomerRecurring: Boolean(customerBlob.isCustomerRecurring),
  billingCycle: Number(customerBlob.billingCycle),
  cycleDay: Number(customerBlob.cycleDay)
});

/**
 * Inserts a new customer information
 * @param {*} customerBlob
 * @returns {Object} New customer information object
 */
const formNewCustomerInformationObject = (customerBlob, customerID) => ({
  accountID: Number(customerBlob.accountID),
  customerID: Number(customerID),
  customerName: customerBlob.customerName,
  customerFirstName: customerBlob.customerFirstName,
  customerLastName: customerBlob.customerLastName,
  customerStreet: customerBlob.customerStreet,
  customerCity: customerBlob.customerCity,
  customerState: customerBlob.customerState,
  customerZip: customerBlob.customerZip,
  customerPhone: customerBlob.customerPhone,
  customerEmail: customerBlob.customerEmail,
  isCustomerAddressActive: Boolean(customerBlob.isCustomerAddressActive),
  isCustomerPhysicalAddress: Boolean(customerBlob.isCustomerPhysicalAddress),
  isCustomerBillingAddress: Boolean(customerBlob.isCustomerBillingAddress),
  isCustomerMailingAddress: Boolean(customerBlob.isCustomerMailingAddress)
});

module.exports = { formNewCustomerObject, formNewCustomerInformationObject };
