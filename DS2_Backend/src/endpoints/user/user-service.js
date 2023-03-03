const accountUserService = {
  getAccountUsers(db, accountID) {
    return db.select().from('users').where('accountID', accountID);
  },

  getActiveAccountUsers(db, accountID) {
    return db.select().from('users').where('accountID', accountID).where('isUserActive', true);
  },

  getInactiveAccountUsers(db, accountID) {
    return db.select().from('users').where('accountID', accountID).where('isUserActive', false);
  },

  updateUser(db, updatedUser, accountID, userID) {
    return db.update(updatedUser).from('users').where('accountID', accountID).where('userID', userID).returning('*');
  },

  insertUser(db, newUser) {
    return db.insert(newUser).into('users').returning('*');
  }
};

module.exports = accountUserService;
