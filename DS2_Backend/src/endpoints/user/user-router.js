const express = require('express');
const userRouter = express.Router();
const accountUserService = require('./user-service');
const userObjects = require('./userObjects');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');

/**
 * Get users
 */
userRouter
  .route('/accountUsers')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID });
    const userAccountID = Number(sanitizedFields.accountID);

    const activeUsers = await accountUserService.getActiveAccountUsers(db, userAccountID);
    const inactiveUsers = await accountUserService.getInactiveAccountUsers(db, userAccountID);
    const allUsers = await accountUserService.getAccountUsers(db, userAccountID);

    res.send({
      activeUsers,
      inactiveUsers,
      allUsers,
      message: 'Success',
      status: 200
    });
  });

/**
 * New User
 */
userRouter
  .route('/new/user')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { accountID, userLoginID, userFirstName, userLastName, displayName, rate, role, accessLevel, isUserActive } = req.body;

    const sanitizedUser = sanitizeFields({
      accountID,
      userLoginID,
      userFirstName,
      userLastName,
      displayName,
      rate,
      role,
      accessLevel,
      isUserActive
    });

    const sanatizedWithDataTypes = userObjects.restoreDataTypes(sanitizedUser);

    const userAccountID = sanatizedWithDataTypes.accountID;

    const newUser = await accountUserService.insertUser(db, sanatizedWithDataTypes);
    const allUsers = await accountUserService.getAccountUsers(db, userAccountID);

    res.send({
      newUser,
      allUsers,
      message: 'New user added',
      status: 200
    });
  });

/**
 * Update User
 */
userRouter
  .route('/update/user')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { userID, accountID, userLoginID, userFirstName, userLastName, displayName, rate, role, accessLevel, isUserActive } = req.body;

    const sanitizedUser = sanitizeFields({
      userID,
      accountID,
      userLoginID,
      userFirstName,
      userLastName,
      displayName,
      rate,
      role,
      accessLevel,
      isUserActive
    });

    const sanatizedWithDataTypes = userObjects.restoreDataTypes(sanitizedUser);

    const usersID = sanatizedWithDataTypes.userID;
    const userAccountID = sanatizedWithDataTypes.accountID;

    const updatedUser = await accountUserService.updateUser(db, sanatizedWithDataTypes, userAccountID, usersID);
    const allUsers = await accountUserService.getAccountUsers(db, userAccountID);

    res.send({
      updatedUser,
      allUsers,
      message: 'User updated',
      status: 200
    });
  });

module.exports = userRouter;
