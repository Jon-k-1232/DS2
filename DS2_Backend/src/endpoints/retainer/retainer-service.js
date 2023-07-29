const retainersService = {
  // Must stay desc, used in finding if an invoice has to be created
  getActiveRetainers(db, accountID) {
    return db.select().from('customer_retainers_and_prepayments').where('account_id', accountID).orderBy('created_at', 'desc');
  },

  getCustomerRetainersByID(db, accountID, customerID) {
    return db.select().from('customer_retainers_and_prepayments').where('account_id', accountID).andWhere('customer_id', customerID);
  },

  getSingleRetainer(db, accountID, retainerID) {
    return db.select().from('customer_retainers_and_prepayments').where('account_id', accountID).andWhere('retainer_id', retainerID);
  },

  updateRetainer(db, updatedRetainer) {
    return db
      .update(updatedRetainer)
      .into('customer_retainers_and_prepayments')
      .where('retainer_id', '=', updatedRetainer.retainer_id)
      .returning('*')
      .then(rows => rows[0]);
  },

  deleteRetainer(db, retainerID, accountID) {
    return db.delete().from('customer_retainers_and_prepayments').where('retainer_id', retainerID).andWhere('account_id', accountID);
  },

  createRetainer(db, newRetainer) {
    return db
      .insert(newRetainer)
      .into('customer_retainers_and_prepayments')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = retainersService;
