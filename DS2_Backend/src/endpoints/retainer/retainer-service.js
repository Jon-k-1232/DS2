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

   getMostRecentRecordOfCustomerRetainers(db, accountID, customerID) {
      return db
         .select('*')
         .from(function () {
            this.select('*', db.raw('ROW_NUMBER() OVER (PARTITION BY COALESCE(parent_retainer_id, retainer_id) ORDER BY created_at DESC) as rn'))
               .from('customer_retainers_and_prepayments')
               .where('account_id', accountID)
               .andWhere('customer_id', customerID)
               .andWhere('current_amount', '<', 0)
               .as('sub');
         })
         .where('rn', 1)
         .orderBy('created_at', 'desc');
   },

   getMostRecentRecordOfSingleRetainer(db, accountID, retainerID) {
      return db
         .select()
         .from('customer_retainers_and_prepayments')
         .where('account_id', accountID)
         .andWhere(function () {
            this.where('retainer_id', retainerID)
               .orWhere('parent_retainer_id', retainerID)
               .orWhere(function () {
                  this.where('retainer_id', db.ref('parent_retainer_id')).andWhere('parent_retainer_id', null);
               });
         })
         .orderBy('created_at', 'desc')
         .limit(1);
   },

   updateRetainer(db, updatedRetainer) {
      return db.update(updatedRetainer).into('customer_retainers_and_prepayments').where('retainer_id', '=', updatedRetainer.retainer_id);
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
