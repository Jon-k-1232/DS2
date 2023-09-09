const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const accountRouter = express.Router();
const accountService = require('./account-service');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { requireAdmin } = require('../auth/jwt-auth');
const { restoreDataTypesAccountOnCreate, restoreDataTypesAccountInformationOnCreate, restoreDataTypesAccountOnUpdate, restoreDataTypesAccountInformationOnUpdate } = require('./accountObjects');
const fs = require('fs').promises;

// Create post to input new account
accountRouter.route('/createAccount').post(jsonParser, async (req, res) => {
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

   const account = {
      returnedFields,
      grid: createGrid([returnedFields])
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
   .all(requireAdmin)
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

      const account = {
         returnedFields,
         grid: createGrid([returnedFields])
      };

      res.send({
         account,
         message: 'Successfully updated customer.',
         status: 200
      });
   });

accountRouter
   .route('/AccountInformation/:accountID/:userID')
   .all(requireAdmin)
   .get(async (req, res) => {
      const db = req.app.get('db');
      const { accountID } = req.params;
      const [data] = await accountService.getAccount(db, accountID);

      const account_logo_buffer = await fs.readFile(data.account_company_logo);
      const accountData = { ...data, account_logo_buffer };

      res.send({
         account: { accountData },
         message: 'Successfully retrieved customer.',
         status: 200
      });
   });

module.exports = accountRouter;
