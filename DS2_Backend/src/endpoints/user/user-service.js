const accountUserService = {
  getActiveAccountUsers(db, accountID) {
    return db.select().from('users').where('users.account_id', '=', accountID).andWhere('users.is_user_active', '=', true);
  },

  createUser(db, accountTableFields) {
    return db
      .insert(accountTableFields)
      .into('users')
      .returning('*')
      .then(rows => rows[0]);
  },

  createAccountLogin(db, accountLoginTableFields) {
    return db
      .insert(accountLoginTableFields)
      .into('user_login')
      .returning('*')
      .then(rows => {
        // Remove the password_hash property from the query results
        delete rows[0].password_hash;
        return rows[0];
      });
  },

  updateUserLogin(db, accountTableFields) {
    return db
      .update(accountTableFields)
      .into('user_login')
      .where('user_login_id', '=', accountTableFields.user_login_id)
      .returning('*')
      .then(rows => rows[0]);
  },

  updateUser(db, accountTableFields) {
    return db
      .update(accountTableFields)
      .into('users')
      .where('user_id', '=', accountTableFields.user_id)
      .returning('*')
      .then(rows => {
        // Remove the password_hash property from the query results
        delete rows[0].password_hash;
        return rows[0];
      });
  },

  deleteUser(db, userID) {
    return db
      .delete()
      .from('users')
      .where('user_id', '=', userID)
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = accountUserService;
