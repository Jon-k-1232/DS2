const express = require('express');
const retainerRouter = express.Router();
const retainerService = require('./retainer-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');

/**
 * Get accounts retainers
 */
retainerRouter
  .route('/all')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.body;

    const retainers = await retainerService.getAllAccountRetainers(db, accountID);

    res.send({
      retainers,
      status: 200
    });
  });

/**
 * For a company, get all the retainers
 */
retainerRouter
  .route('/allCompanyRetainers')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, customerID } = req.body;

    const retainers = await retainerService.getAllCompanyRetainers(db, accountID, customerID);

    res.send({
      retainers,
      status: 200
    });
  });

/**
 * For a company, get all the advanced payments that still have available balances
 */
retainerRouter
  .route('/CompanyRetainersGreaterThanZero')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, customerID } = req.body;

    const retainers = await retainerService.getCompanyRetainersGreaterThanZero(db, accountID, customerID);

    res.send({
      retainers,
      status: 200
    });
  });

/**
 * For a company, update the available amount
 */
retainerRouter
  .route('/update/availableAmount')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { accountID, customerID, availableAmount } = req.body;

    const cleanedFields = sanitizeFields({ accountID, customerID, availableAmount });
    const sanitizedAccountID = cleanedFields.accountID;
    const sanitizedCustomerID = cleanedFields.customerID;
    const sanitizedAvailableAmount = cleanedFields.availableAmount;

    const retainers = await retainerService.updateRetainer(db, sanitizedAvailableAmount, sanitizedAccountID, sanitizedCustomerID);

    res.send({
      retainers,
      status: 200
    });
  });

module.exports = retainerRouter;
