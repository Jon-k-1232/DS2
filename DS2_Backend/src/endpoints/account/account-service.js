const accountService = {
  getUserAccount(db, accountID) {
    return db('account')
      .where('account.accountID', accountID)
      .join('accountInformation', 'account.accountInformationID', '=', 'accountInformation.accountInformationID');
  }
};

module.exports = accountService;
