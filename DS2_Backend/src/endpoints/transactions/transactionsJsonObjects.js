const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createTransactionsReturnObject = {
   activeTransactionsData: activeTransactions => ({
      activeTransactions,
      grid: createGrid(activeTransactions)
   }),

   // switched from activeTransaction to transactionData - transaction edit uses transactionData
   activeTransactionData: transactionData => ({
      transactionData,
      grid: createGrid(transactionData)
   })
};

module.exports = createTransactionsReturnObject;
