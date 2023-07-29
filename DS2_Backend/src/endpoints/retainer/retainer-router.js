const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const retainerRouter = express.Router();
const retainerService = require('./retainer-service');
const { restoreDataTypesRetainersTableOnCreate, restoreDataTypesRetainersTableOnUpdate } = require('./retainerObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');

// Create a new retainer
retainerRouter
  .route('/createRetainer/:accountID/:userID')
  // .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedNewRetainer = sanitizeFields(req.body.retainer);

    // Create new object with sanitized fields
    const retainerTableFields = restoreDataTypesRetainersTableOnCreate(sanitizedNewRetainer);

    // Post new retainer
    await retainerService.createRetainer(db, retainerTableFields);

    // Get all retainers
    const activeRetainers = await retainerService.getActiveRetainers(db, retainerTableFields.account_id);

    const activeRetainerData = {
      activeRetainers,
      grid: createGrid(activeRetainers)
    };

    res.send({
      accountRetainersList: { activeRetainerData },
      message: 'Successfully created new retainer.',
      status: 200
    });
  });

// Get all active retainers
retainerRouter
  .route('/getActiveRetainers/:accountID/:userID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;

    const activeRetainers = await retainerService.getActiveRetainers(db, accountID);

    const activeRetainerData = {
      activeRetainers,
      grid: createGrid(activeRetainers)
    };

    res.send({
      accountRetainersList: { activeRetainerData },
      message: 'Successfully retrieved all active retainers.',
      status: 200
    });
  });

// Update a retainer
retainerRouter
  .route('/updateRetainer')
  // .all(requireAuth)
  .patch(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedUpdatedRetainer = sanitizeFields(req.body.retainer);

    // Create new object with sanitized fields
    const retainerTableFields = restoreDataTypesRetainersTableOnUpdate(sanitizedUpdatedRetainer);

    // Update retainer
    await retainerService.updateRetainer(db, retainerTableFields);

    // Get all retainers
    const retainersData = await retainerService.getActiveRetainers(db, retainerTableFields.account_id);

    // Create grid for Mui Grid
    const grid = createGrid(retainersData);

    const retainer = {
      retainersData,
      grid
    };

    res.send({
      retainer,
      message: 'Successfully updated retainer.',
      status: 200
    });
  });

// Delete a retainer
retainerRouter
  .route('/deleteRetainer/:retainerID/:accountID/:userID')
  // .all(requireAuth)
  .delete(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { retainerID, accountID } = req.params;

    // Delete retainer
    await retainerService.deleteRetainer(db, retainerID, accountID);

    // Get all retainers
    const activeRetainers = await retainerService.getActiveRetainers(db, accountID);

    const activeRetainerData = {
      activeRetainers,
      grid: createGrid(activeRetainers)
    };

    res.send({
      accountRetainersList: { activeRetainerData },
      message: 'Successfully deleted retainer.',
      status: 200
    });
  });

// get single retainer
retainerRouter
  .route('/getSingleRetainer/:retainerID/:accountID/:userID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { retainerID, accountID } = req.params;

    const activeRetainer = await retainerService.getSingleRetainer(db, accountID, retainerID);

    const activeRetainerData = {
      activeRetainer,
      grid: createGrid(activeRetainer)
    };

    res.send({
      activeRetainerData,
      message: 'Successfully retrieved single retainer.',
      status: 200
    });
  });

module.exports = retainerRouter;
