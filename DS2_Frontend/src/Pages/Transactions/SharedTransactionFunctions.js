import dayjs from 'dayjs';

export const formObjectForPost = (selectedItems, loggedInUser, transactionType) => {
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
