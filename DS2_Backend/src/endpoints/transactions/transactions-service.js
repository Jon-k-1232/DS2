const transactionsService = {
   // Must stay desc, used in finding if an invoice has to be created
   getActiveTransactions(db, accountID) {
      return db
         .select(
            'customer_transactions.*',
            db.raw('customers.display_name as customer_name'),
            db.raw('users.display_name as logged_for_user_name'),
            'customer_general_work_descriptions.general_work_description',
            'customer_jobs.job_type_id',
            'customer_job_types.job_description'
         )
         .from('customer_transactions')
         .join('customers', 'customer_transactions.customer_id', 'customers.customer_id')
         .join('users', 'customer_transactions.logged_for_user_id', 'users.user_id')
         .join('customer_general_work_descriptions', 'customer_transactions.general_work_description_id', 'customer_general_work_descriptions.general_work_description_id')
         .join('customer_jobs', 'customer_transactions.customer_job_id', 'customer_jobs.customer_job_id')
         .join('customer_job_types', 'customer_jobs.job_type_id', 'customer_job_types.job_type_id')
         .where('customer_transactions.account_id', accountID)
         .orderBy('customer_transactions.created_at', 'desc');
   },

   getTransactionsBetweenDates(db, accountID, start_date, end_date) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('transaction_date', '>=', start_date).andWhere('transaction_date', '<=', end_date);
   },

   getCustomerTransactionsByID(db, accountID, customerID) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('customer_id', customerID).orderBy('transaction_date', 'desc');
   },

   getTransactionsForInvoice(db, accountID, invoiceID) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('customer_invoice_id', invoiceID);
   },

   getSingleTransaction(db, accountID, customerID, transactionID) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('customer_id', customerID).andWhere('transaction_id', transactionID);
   },

   getTransactionsByRetainerID(db, retainerID) {
      return db.select().from('customer_transactions').where('retainer_id', retainerID);
   },

   getTransactionsByJobID(db, accountID, jobID) {
      return db.select().from('customer_transactions').where('account_id', accountID).andWhere('customer_job_id', jobID);
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
