const paymentsService = {
   // Must stay desc, used in finding if an invoice has to be created
   getActivePayments(db, accountID) {
      return db
         .select('customer_payments.*', db.raw('customers.display_name as customer_name'), db.raw('users.display_name as created_by_user_name'))
         .from('customer_payments')
         .join('customers', 'customer_payments.customer_id', 'customers.customer_id')
         .join('users', 'customer_payments.created_by_user_id', 'users.user_id')
         .where('customer_payments.account_id', accountID)
         .orderBy('customer_payments.created_at', 'desc');
   },

   getSinglePayment(db, paymentID, accountID) {
      return db.select().from('customer_payments').andWhere('payment_id', Number(paymentID));
   },

   getPaymentsForInvoice(db, accountID, invoiceID) {
      return db.select().from('customer_payments').where('account_id', accountID).andWhere('customer_invoice_id', invoiceID);
   },

   updatePayment(db, updatedPayment) {
      return db
         .update(updatedPayment)
         .into('customer_payments')
         .where('payment_id', '=', updatedPayment.payment_id)
         .returning('*')
         .then(rows => rows[0]);
   },

   deletePayment(db, paymentID) {
      return db
         .delete()
         .from('customer_payments')
         .where('payment_id', '=', paymentID)
         .returning('*')
         .then(rows => rows[0]);
   },

   createPayment(db, newPayment) {
      return db
         .insert(newPayment)
         .into('customer_payments')
         .returning('*')
         .then(rows => rows[0]);
   }
};

module.exports = paymentsService;
