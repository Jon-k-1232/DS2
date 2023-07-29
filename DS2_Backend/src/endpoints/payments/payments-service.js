const paymentsService = {
  // Must stay desc, used in finding if an invoice has to be created
  getActivePayments(db, accountID) {
    return db.select().from('customer_payments').where('account_id', accountID).orderBy('created_at', 'desc');
  },

  getSinglePayment(db, paymentID, accountID) {
    return db.select().from('customer_payments').andWhere('payment_id', Number(paymentID));
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
