const writeOffsService = {
  getActiveWriteOffs(db, accountID) {
    return db.select().from('customer_writeoffs').where('account_id', accountID);
  },

  getSingleWriteOff(db, writeOffID, accountID) {
    return db.select().from('customer_writeoffs').where('writeoff_id', writeOffID).andWhere('account_id', accountID);
  },

  updateWriteOff(db, updatedWriteOff) {
    return db.update(updatedWriteOff).into('customer_writeoffs').where('writeoff_id', '=', updatedWriteOff.writeoff_id);
  },

  deleteWriteOff(db, writeOffID, accountID) {
    return db.delete().from('customer_writeoffs').where('writeoff_id', writeOffID).andWhere('account_id', accountID);
  },

  createWriteOff(db, newWriteOff) {
    return db
      .insert(newWriteOff)
      .into('customer_writeoffs')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = writeOffsService;
