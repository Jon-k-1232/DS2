const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const accountRouter = express.Router();
const accountService = require('./account-service');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const {
  restoreDataTypesAccountOnCreate,
  restoreDataTypesAccountInformationOnCreate,
  restoreDataTypesAccountOnUpdate,
  restoreDataTypesAccountInformationOnUpdate
} = require('./accountObjects');

// Create post to input new account
accountRouter
  .route('/createAccount')
  // .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedNewAccount = sanitizeFields(req.body.account);

    // Create new object with sanitized fields
    const accountTableFields = restoreDataTypesAccountOnCreate(sanitizedNewAccount);

    // Post new account
    const accountData = await accountService.createAccount(db, accountTableFields);

    // need the account number to post to account_information table, then merge account to sanitizedData, then insert
    const { account_id } = accountData;
    const updatedWithAccountID = { ...sanitizedNewAccount, account_id };
    const accountInfoTableFields = restoreDataTypesAccountInformationOnCreate(updatedWithAccountID);
    // Post new account information
    const accountInfoData = await accountService.createAccountInformation(db, accountInfoTableFields);

    // Join account and accountInfo returned values
    const returnedFields = { ...accountData, ...accountInfoData };

    // Create grid for Mui Grid
    const grid = createGrid([returnedFields]);

    const account = {
      returnedFields,
      grid
    };

    res.send({
      account,
      message: 'Successfully updated customer.',
      status: 200
    });
  });

// Create put endpoint to update accounts and account_information tables
accountRouter
  .route('/updateAccount')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    // Sanitize fields
    const sanitizedAccount = sanitizeFields(req.body.account);

    // Create new object with sanitized fields
    const accountTableFields = restoreDataTypesAccountOnUpdate(sanitizedAccount);
    const accountInfoTableFields = restoreDataTypesAccountInformationOnUpdate(sanitizedAccount);

    const accountData = await accountService.updateAccount(db, accountTableFields);
    const accountInfoData = await accountService.updateAccountInformation(db, accountInfoTableFields);

    // Join account and accountInfo returned values
    const returnedFields = { ...accountData, ...accountInfoData };

    // Create grid for Mui Grid
    const grid = createGrid([returnedFields]);

    const account = {
      returnedFields,
      grid
    };

    res.send({
      account,
      message: 'Successfully updated customer.',
      status: 200
    });
  });

// Endpoint to get account and account information
accountRouter
  .route('/getAccount/:accountID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;
    const accountData = await accountService.getAccount(db, accountID);

    // Create Mui Grid
    const grid = createGrid(accountData);

    // Return Object
    const account = {
      accountData,
      grid
    };

    res.send({
      account,
      message: 'Successfully retrieved customer.',
      status: 200
    });
  });

// Delete account
accountRouter
  .route('/deleteAccount/:accountID')
  // .all(requireAuth)
  .delete(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;
    const accountData = await accountService.deleteAccount(db, accountID);

    const grid = createGrid([accountData]);

    const account = {
      accountData,
      grid
    };

    res.send({
      account,
      message: 'Successfully deleted customer.',
      status: 200
    });
  });

module.exports = accountRouter;
