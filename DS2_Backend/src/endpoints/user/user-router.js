const express = require('express');
const userRouter = express.Router();
const accountUserService = require('./user-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const {
  restoreDataTypesUserOnCreate,
  restoreDataTypesUserLoginOnCreate,
  restoreDataTypesUserOnUpdate,
  restoreDataTypesUserLoginOnUpdate
} = require('./userObjects');

// Get all active users for an account
userRouter
  .route('/accountUsers/:accountID/:userID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;

    // Get active users
    const activeUsers = await accountUserService.getActiveAccountUsers(db, accountID);

    // Create Mui Grid
    const grid = createGrid(activeUsers);

    // Return Object
    const activeUserData = {
      activeUsers,
      grid
    };

    res.send({
      activeUserData,
      message: 'Success',
      status: 200
    });
  });

// Create a new user
userRouter
  .route('/createUser/:accountID/:userID')
  // .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedNewUser = sanitizeFields(req.body.user);

    // Create new object with sanitized fields
    const userDataTypes = restoreDataTypesUserOnCreate(sanitizedNewUser);

    // Post new account
    const userData = await accountUserService.createUser(db, userDataTypes);

    // Gets the user id that was created by user table
    const { user_id, account_id } = userData;
    // Merging the user_id with the sanitizedNewAccount object
    const updatedWithAccountID = { ...sanitizedNewUser, user_id };
    // Create new object with sanitized fields
    const userLoginDataTypes = restoreDataTypesUserLoginOnCreate(updatedWithAccountID);
    // Post new account login
    await accountUserService.createAccountLogin(db, userLoginDataTypes);

    // Get all active users
    const activeUsers = await accountUserService.getActiveAccountUsers(db, account_id);

    // Return Object
    const activeUserData = {
      activeUsers,
      grid: createGrid(activeUsers)
    };

    res.send({
      teamMembersList: { activeUserData },
      message: 'Success',
      status: 200
    });
  });

// Update user_login table
userRouter
  .route('/updateUserLogin')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    // Sanitize fields
    const sanitizedUpdatedUser = sanitizeFields(req.body.user);

    // Create new object with sanitized fields
    const userDataTypes = restoreDataTypesUserLoginOnUpdate(sanitizedUpdatedUser);

    // Update user
    const returnedFields = await accountUserService.updateUserLogin(db, userDataTypes);

    // Create grid for Mui Grid
    const grid = createGrid([returnedFields]);

    // Return Object
    const userLogin = {
      returnedFields,
      grid
    };

    res.send({
      userLogin,
      message: 'Successfully updated',
      status: 200
    });
  });

// Update users table
userRouter
  .route('/updateUser')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    // Sanitize fields
    const sanitizedUpdatedUser = sanitizeFields(req.body.user);

    // Create new object with sanitized fields
    const userDataTypes = restoreDataTypesUserOnUpdate(sanitizedUpdatedUser);

    // Update user
    const returnedFields = await accountUserService.updateUser(db, userDataTypes);

    // Create grid for Mui Grid
    const grid = createGrid([returnedFields]);

    // Return Object
    const user = {
      returnedFields,
      grid
    };

    res.send({
      user,
      message: 'Successfully updated',
      status: 200
    });
  });

// Delete user
userRouter
  .route('/deleteUser/:userID/:accountID')
  // .all(requireAuth)
  .delete(async (req, res) => {
    const db = req.app.get('db');
    const { userID, accountID } = req.params;

    // Delete user
    await accountUserService.deleteUser(db, userID);

    // Get all active users
    const activeUsers = await accountUserService.getActiveAccountUsers(db, accountID);

    // Create grid for Mui Grid
    const grid = createGrid(activeUsers);

    // Return Object
    const user = {
      activeUsers,
      grid
    };

    res.send({
      user,
      message: 'Successfully deleted',
      status: 200
    });
  });

module.exports = userRouter;
