const express = require('express');
const userRouter = express.Router();
const accountUserService = require('./user-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const {
  restoreDataTypesUserOnCreate,
  restoreDataTypesUserLoginOnCreate,
  restoreDataTypesUserOnUpdate,
  restoreDataTypesUserLoginOnUpdate
} = require('./userObjects');

// Create a new user
userRouter.route('/createUser/:accountID/:userID').post(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const { accountID } = req.params;

  const insertNewUser = async () => {
    const userWithAccountID = { ...req.body.user, accountID };
    const sanitizedNewUser = sanitizeFields(userWithAccountID);

    // Create new object with sanitized fields
    const userDataTypes = restoreDataTypesUserOnCreate(sanitizedNewUser);
    // Post new account
    const userData = await accountUserService.createUser(db, userDataTypes);
    // Gets the user id that was created by user table
    const { user_id, account_id } = userData;
    // Merging the new user_id with the sanitizedNewAccount object
    const updatedWithAccountID = { ...sanitizedNewUser, user_id };

    // Create new object with sanitized fields
    const userLoginDataTypes = await restoreDataTypesUserLoginOnCreate(updatedWithAccountID);
    // Post new account login
    await accountUserService.createAccountLogin(db, userLoginDataTypes);

    // Get all active users and send 200 status
    await updatedTeamMembers(db, res, account_id);
  };

  try {
    await insertNewUser();
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while creating the user.',
      status: 500
    });
  }
});

// Edit User
userRouter.route('/updateUser/:accountID/:userID').put(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const { accountID } = req.params;

  const updateUser = async () => {
    // Sanitize fields
    const sanitizedUpdatedUser = sanitizeFields(req.body.user);

    // Create new object with sanitized fields
    const userDataTypes = restoreDataTypesUserOnUpdate(sanitizedUpdatedUser);

    // Update user
    await accountUserService.updateUser(db, userDataTypes);

    // Get all active users and send 200 status
    await updatedTeamMembers(db, res, accountID);
  };

  try {
    await updateUser();
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while creating the user.',
      status: 500
    });
  }
});

// Edit User Login
userRouter.route('/updateUserLogin/:accountID/:userID').put(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const userLoginDetails = req.body.userLogin;

  const updateUserLogin = async () => {
    // Sanitize fields
    const sanitizedUpdatedUserLogin = sanitizeFields(userLoginDetails);
    const updatedData = await restoreDataTypesUserLoginOnUpdate(sanitizedUpdatedUserLogin);

    // Create an object to store the properties that need to be updated
    let updateObject = {
      is_login_active: updatedData.is_login_active
    };

    if (sanitizedUpdatedUserLogin.userLoginPassword && sanitizedUpdatedUserLogin.userLoginPassword.length) {
      updateObject.password_hash = updatedData.password_hash;
    }

    if (sanitizedUpdatedUserLogin.userLoginName && sanitizedUpdatedUserLogin.userLoginName.length) {
      updateObject.user_name = updatedData.user_name;
    }

    // Update user
    await accountUserService.updateUserLogin(db, updateObject, updatedData.user_login_id);

    // Get all active users and send 200 status
    await updatedTeamMembers(db, res, updatedData.account_id);
  };

  try {
    await updateUserLogin();
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while updating the user.',
      status: 500
    });
  }
});

// Delete user
userRouter.route('/deleteUser/:accountID/:userID').delete(async (req, res) => {
  const db = req.app.get('db');
  const { userID, accountID } = req.params;

  const deleteUser = async () => {
    await accountUserService.deleteUserLogin(db, userID);
    await accountUserService.deleteUser(db, userID);

    // Get all active users and send 200 status
    await updatedTeamMembers(db, res, accountID);
  };

  try {
    await deleteUser();
  } catch {
    res.send({
      message: 'The user cannot be deleted because data tied to this user exists.',
      status: 500
    });
  }
});

// fetch single user
userRouter.route('/fetchSingleUser/:accountID/:userID').get(async (req, res) => {
  const db = req.app.get('db');
  const { accountID, userID } = req.params;

  // Get user
  const [activeUser] = await accountUserService.fetchUser(db, accountID, userID);
  const [activeUserLogin] = await accountUserService.fetchUserLogin(db, activeUser);
  activeUser.user_login_id = activeUserLogin.user_login_id;

  // Return Object
  const activeUserData = {
    activeUser,
    grid: createGrid(activeUser)
  };

  res.send({
    activeUserData,
    message: 'Successfully fetched',
    status: 200
  });
});

module.exports = userRouter;

const updatedTeamMembers = async (db, res, accountID) => {
  // Get all active users
  const activeUsers = await accountUserService.getActiveAccountUsers(db, accountID);

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
};
