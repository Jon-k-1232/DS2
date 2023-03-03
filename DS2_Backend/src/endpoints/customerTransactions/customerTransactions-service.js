const transactionService = {
  // Get all transactions for an account
  getAllTransactions(db, accountID) {
    return db
      .select()
      .from('customerTransactions')
      .where('customerTransactions.accountID', accountID)
      .join('customerInformation', 'customerTransactions.customerID', '=', 'customerInformation.customerInformationID')
      .join('customerJobs', 'customerTransactions.customerJobID', '=', 'customerJobs.customerJobID')
      .join('users', 'customerTransactions.accountEmployeeID', '=', 'users.userID');
  },

  // Get all transactions for a specific customer
  getCustomerTransactions(db, accountID, customerID) {
    return db
      .select()
      .from('customerTransactions')
      .where('customerTransactions.accountID', accountID)
      .where('customerTransactions.customerID', customerID)
      .join('customerInformation', 'customerTransactions.customerID', '=', 'customerInformation.customerInformationID')
      .join('customerJobs', 'customerTransactions.customerJobID', '=', 'customerJobs.customerJobID')
      .join('users', 'customerTransactions.accountEmployeeID', '=', 'users.userID');
  },

  // Get all transactions for a specific job
  getTransactionsForCustomerJobs(db, customerID, accountID, jobID) {
    return db
      .select()
      .from('customerTransactions')
      .where('customerTransactions.accountID', accountID)
      .where('customerTransactions.customerID', customerID)
      .where('customerTransactions.customerJobID', jobID)
      .join('customerInformation', 'customerTransactions.customerID', '=', 'customerInformation.customerInformationID')
      .join('customerJobs', 'customerTransactions.customerJobID', '=', 'customerJobs.customerJobID')
      .join('users', 'customerTransactions.accountEmployeeID', '=', 'users.userID');
  },

  // Insert a new transaction
  insertNewTransaction(db, newTransaction) {
    return db.insert(newTransaction).into('customerTransactions').returning('*');
  },

  // Delete a transaction
  deleteTransaction(db, accountID, customerTransactionsID) {
    return db
      .from('customerTransactions')
      .where('accountID', accountID)
      .where('customerTransactionID', customerTransactionsID)
      .del()
      .returning('*');
  }
};

module.exports = transactionService;
