const transactionsService = {
   // Must stay desc, used in finding if an invoice has to be created
   getActiveTransactions(db, accountID) {
      return db.select().from('customer_transactions').where('account_id', accountID).orderBy('created_at', 'desc');
   },

   getCustomerTransactionsByID(db, accountID, customerID) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('customer_id', customerID).orderBy('transaction_date', 'desc');
   },

   getSingleTransaction(db, accountID, customerID, transactionID) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('customer_id', customerID).andWhere('transaction_id', transactionID);
   },

   updateTransaction(db, updatedTransaction) {
      return db.update(updatedTransaction).into('customer_transactions').where('transaction_id', updatedTransaction.transaction_id);
   },

   deleteTransaction(db, transactionID) {
      return db.delete().from('customer_transactions').where('transaction_id', '=', transactionID);
   },

   createTransaction(db, newTransaction) {
      return db
         .insert(newTransaction)
         .into('customer_transactions')
         .returning('*')
         .then(rows => rows[0]);
   },

   upsertTransactions(db, transactions) {
      if (!transactions.length) return [];
      return db.insert(transactions).into('customer_transactions').onConflict('transaction_id').merge();
   }
};

module.exports = transactionsService;
