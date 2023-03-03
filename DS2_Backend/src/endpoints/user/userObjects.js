const restoreDataTypes = sanitizedUser => ({
  accountID: Number(sanitizedUser.accountID),
  userLoginID: Number(sanitizedUser.userLoginID),
  userFirstName: sanitizedUser.userFirstName,
  userLastName: sanitizedUser.userLastName,
  displayName: sanitizedUser.displayName,
  rate: Number(sanitizedUser.rate),
  role: sanitizedUser.role,
  accessLevel: Number(sanitizedUser.accessLevel),
  isUserActive: Boolean(sanitizedUser.isUserActive)
});

module.exports = { restoreDataTypes };
