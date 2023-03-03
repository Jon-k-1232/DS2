const retainerService = {
  getAllAccountRetainers(db, customerID) {
    return db.select().from('customerRetainerLedger').where('customerID', customerID);
  },

  getAllCompanyRetainers(db, accountID, customerID) {
    return db.select().from('customerRetainerLedger').where('accountID', accountID).where('customerID', customerID);
  },

  getCompanyRetainersGreaterThanZero(db, accountID, customerID) {
    return db
      .select()
      .from('customerRetainerLedger')
      .where('accountID', accountID)
      .where('customerID', customerID)
      .where('availableAmount', '>', 0);
  },

  insertNewRetainer(db, newRetainer, accountID, customerID) {
    return db
      .insert(newRetainer)
      .into('customerRetainerLedger')
      .where('accountID', accountID)
      .where('customerID', customerID)
      .returning('*');
  },

  updateRetainer(db, availableAmount, accountID, customerID) {
    return db
      .update(availableAmount)
      .from('customerRetainerLedger')
      .where('accountID', accountID)
      .where('customerID', customerID)
      .returning('*');
  },

  getRetainerSnapshotsForInvoice(db, accountID, customerID, invoiceNumber) {
    return db
      .select()
      .from('customerRetainerSnapshots')
      .where('accountID', accountID)
      .where('customerID', customerID)
      .where('invoiceNumber', invoiceNumber);
  },

  insertRetainerSnapshot(db, retainer, accountID, customerID) {
    return db
      .insert(retainer)
      .from('customerRetainerSnapshots')
      .where('accountID', accountID)
      .where('customerID', customerID)
      .returning('*');
  }
};

module.exports = retainerService;
