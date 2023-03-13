import dayjs from 'dayjs';

export const formObjectForTransactionPost = (selectedItems, loggedInUser, transactionType) => {
  const {
    selectedCustomer,
    selectedJob,
    selectedTeamMember,
    selectedDate,
    detailedJobDescription,
    isTransactionBillable,
    unitCost,
    quantity
  } = selectedItems;
  const { accountID, userID } = loggedInUser;

  return {
    accountID: accountID,
    customerID: selectedCustomer.customerID,
    customerJobID: selectedJob.customerJobID,
    loggedByUserID: userID,
    loggedForUserID: selectedTeamMember.userID,
    detailedJobDescription: detailedJobDescription,
    customerInvoicesID: '',
    dateCreated: dayjs().format(),
    transactionDate: dayjs(selectedDate).format(),
    transactionType,
    quantity: quantity,
    unitCost: unitCost,
    totalTransaction: (quantity * unitCost).toFixed(2),
    isTransactionBillable: isTransactionBillable
  };
};

export const formObjectForCustomerPost = (selectedItems, loggedInUser) => {
  const { accountID, userID } = loggedInUser;
  const {
    customerEntityType,
    customerBusinessName,
    customerFirstName,
    customerLastName,
    customerStreet,
    customerCity,
    customerState,
    customerZip,
    customerPhone,
    customerEmail,
    isCustomerAddressActive,
    isCustomerPhysicalAddress,
    isCustomerBillingAddress,
    isCustomerMailingAddress,
    isCustomerActive,
    isCustomerBillable,
    isCustomerRecurring,
    recurringAmount,
    billingCycle
  } = selectedItems;

  return {
    accountID: accountID,
    userID: userID,
    customerEntityType,
    customerBusinessName,
    customerName: `${customerFirstName} ${customerLastName}`,
    customerFirstName,
    customerLastName,
    customerStreet,
    customerCity,
    customerState,
    customerZip,
    customerPhone,
    customerEmail,
    isCustomerAddressActive,
    isCustomerPhysicalAddress,
    isCustomerBillingAddress,
    isCustomerMailingAddress,
    isCustomerActive,
    isCustomerBillable,
    isCustomerRecurring,
    recurringAmount: recurringAmount.toFixed(2),
    billingCycle,
    dateCreated: dayjs().format()
  };
};
