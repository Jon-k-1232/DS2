const express = require('express');
const authService = require('./auth-service');
const userService = require('../user/user-service');
const authentication = express.Router();
const config = require('../../../config');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const ip = require('ip');

// JWT Creation Endpoint
authentication.post('/login', jsonParser, async (req, res, next) => {
  const db = req.app.get('db');
  const { suppliedUsername, suppliedPassword } = req.body;
  const login_ip = req.ip;

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
    const [user] = await authService.getUserByUserName(db, sanitizedUserName);

    if (!user) {
      return res.status(400).json({
        error: 'Incorrect username',
        status: 401
      });
    }

    const { user_id, user_name, password_hash, account_id } = user;

    // comparePasswords should be used here instead of direct comparison
    if (!(await authService.comparePasswords(sanitizedPassword, password_hash))) {
      return res.status(400).json({
        error: 'Incorrect password',
        status: 401
      });
    }

    const [getUserInformation] = await authService.getUserInformation(db, account_id, user_id);

    // Inserts login log into DB
    const userLog = { user_id, account_id, login_ip };
    await authService.insertLoginLog(db, userLog);

    // Returns JWT token and user info to set front, so front end can then make another call for data
    const sub = user_name;
    const payload = { user_id };

    // Create JWT token

    const authToken = authService.createJwt(sub, payload);

    // Set JWT in a cookie
    res.cookie('session', authToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    });

    res.send({
      user: getUserInformation,
      authToken: authToken,
      status: 200
    });
  } catch (err) {
    next(err);
  }
});

module.exports = authentication;
