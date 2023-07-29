const ip = require('ip');

const restoreDataTypesUserOnCreate = userData => ({
  account_id: Number(userData.accountID),
  email: userData.userEmail,
  display_name: userData.userDisplayName,
  cost_rate: Number(userData.costRate),
  billing_rate: Number(userData.billingRate),
  job_title: userData.role,
  access_level: userData.accessLevel,
  last_login_date: userData.lastLoginDate || new Date(),
  login_ip: userData.loginIp || ip.address(),
  is_user_active: Boolean(userData.isActive) || true
});

const restoreDataTypesUserLoginOnCreate = sanitizedUserLogin => ({
  account_id: Number(sanitizedUserLogin.accountID),
  user_id: Number(sanitizedUserLogin.user_id),
  user_name: sanitizedUserLogin.userLoginName,
  password_hash: sanitizedUserLogin.userLoginPassword,
  is_login_active: Boolean(sanitizedUserLogin.isLoginActive) || true
});

const restoreDataTypesUserOnUpdate = sanitizedUser => ({
  user_id: Number(sanitizedUser.user_id),
  account_id: Number(userData.accountID),
  email: userData.email,
  display_name: userData.displayName,
  cost_rate: Number(userData.costRate),
  billing_rate: Number(userData.billingRate),
  job_title: userData.jobTitle,
  access_level: userData.accessLevel,
  last_login_date: userData.lastLoginDate || new Date(),
  login_ip: userData.loginIp || ip.address(),
  is_user_active: Boolean(userData.isActive) || true
});

const restoreDataTypesUserLoginOnUpdate = sanitizedUserLogin => ({
  user_login_id: Number(sanitizedUserLogin.userLoginID),
  account_id: Number(sanitizedUserLogin.accountID),
  user_id: Number(sanitizedUserLogin.user_id),
  user_name: sanitizedUserLogin.userLoginName,
  password_hash: sanitizedUserLogin.userLoginPassword,
  is_login_active: Boolean(sanitizedUserLogin.isLoginActive) || true
});

module.exports = {
  restoreDataTypesUserOnCreate,
  restoreDataTypesUserLoginOnCreate,
  restoreDataTypesUserOnUpdate,
  restoreDataTypesUserLoginOnUpdate
};
