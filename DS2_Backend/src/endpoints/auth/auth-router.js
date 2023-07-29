const express = require('express');
const authService = require('./auth-service');
const accountService = require('../account/account-service');
const authentication = express.Router();
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');

// JWT check for login.
authentication.post('/login', jsonParser, async (req, res, next) => {
  const db = req.app.get('db');
  const { suppliedUsername, suppliedPassword } = req.body;

  const sanitizedFields = sanitizeFields({ suppliedUsername, suppliedPassword });
  const sanitizedUserName = sanitizedFields.suppliedUsername;
  const sanitizedPassword = sanitizedFields.suppliedPassword;

  if (!sanitizedUserName || !sanitizedPassword) {
    return res.status(400).json({
      error: 'Missing username or password in request body',
      status: 400
    });
  }

  try {
    // Looks up username in DB, DO NOT RETURN TO FRONT END
    const user = await authService.getUserByUserName(db, sanitizedUserName);
    const { userLoginID, userLogin, password } = user[0];

    if (!user[0] || userLogin !== sanitizedUserName) {
      return res.status(400).json({
        error: 'Incorrect username',
        status: 401
      });
    }

    // comparePasswords should be used here instead of direct comparison
    if (!(await authService.comparePasswords(sanitizedPassword, password))) {
      return res.status(400).json({
        error: 'Incorrect password',
        status: 401
      });
    }

    // Gets user information from DB
    const userInformation = await authService.getUserInformation(db, userLoginID);
    const { accountID } = userInformation[0];

    // get account information from account service
    const accountInformation = await accountService.getUserAccount(db, accountID);

    // Returns JWT token and user info to set front, so front end can then make another call for data
    const sub = username;
    const payload = { userID: userLoginID };

    res.send({
      userInformation,
      accountInformation,
      authToken: authService.createJwt(sub, payload),
      status: 200
    });
  } catch (err) {
    next(err);
  }
});

module.exports = authentication;
