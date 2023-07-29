const express = require('express');
const jobTypeRouter = express.Router();
const jobTypeService = require('./jobType-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const { restoreDataTypesJobTypeTableOnCreate, restoreDataTypesJobTypeTableOnUpdate } = require('./jobTypeObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');

// Create a new jobType
jobTypeRouter
  .route('/createJobType/:accountID/:userID')
  // .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedNewJobType = sanitizeFields(req.body.jobType);

    // Create new object with sanitized fields
    const jobTypeTableFields = restoreDataTypesJobTypeTableOnCreate(sanitizedNewJobType);

    // Post new jobType
    await jobTypeService.createJobType(db, jobTypeTableFields);

    // Get all jobTypes
    const jobTypesData = await jobTypeService.getActiveJobTypes(db, jobTypeTableFields.account_id);

    const activeJobTypesData = {
      jobTypesData,
      grid: createGrid(jobTypesData)
    };

    res.send({
      jobTypesList: { activeJobTypesData },
      message: 'Successfully created new jobType.',
      status: 200
    });
  });

// Get single jobType
jobTypeRouter
  .route('/getSingleJobType/:jobTypeID/:account/:userID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { jobTypeID, account } = req.params;

    const activeJobs = await jobTypeService.getSingleJobType(db, jobTypeID, account);

    const activeJobData = {
      activeJobs,
      grid: createGrid(activeJobs)
    };

    res.send({
      activeJobData,
      message: 'Successfully retrieved single jobType.',
      status: 200
    });
  });

// Get all active jobTypes
jobTypeRouter
  .route('/getActiveJobTypes/:accountID/:userID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;

    const jobTypesData = await jobTypeService.getActiveJobTypes(db, accountID);

    // Return Object
    const activeJobTypesData = {
      jobTypesData,
      grid: createGrid(jobTypesData)
    };

    res.send({
      activeJobTypesData,
      message: 'Successfully retrieved all active jobTypes.',
      status: 200
    });
  });

// Update a jobType
jobTypeRouter
  .route('/updateJobType')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedUpdatedJobType = sanitizeFields(req.body.jobType);

    // Create new object with sanitized fields
    const jobTypeTableFields = restoreDataTypesJobTypeTableOnUpdate(sanitizedUpdatedJobType);

    // Update jobType
    await jobTypeService.updateJobType(db, jobTypeTableFields);

    // Get all jobTypes
    const jobTypesData = await jobTypeService.getActiveJobTypes(db, jobTypeTableFields.account_id);

    // Create grid for Mui Grid
    const grid = createGrid(jobTypesData);

    const jobType = {
      jobTypesData,
      grid
    };

    res.send({
      jobType,
      message: 'Successfully updated jobType.',
      status: 200
    });
  });

// Delete a jobType
jobTypeRouter
  .route('/deleteJobType/:jobTypeID/:accountID/:userID')
  // .all(requireAuth)
  .delete(async (req, res) => {
    const db = req.app.get('db');
    const { jobTypeID, accountID } = req.params;

    // Delete jobType
    await jobTypeService.deleteJobType(db, jobTypeID);

    // Get all jobTypes
    const jobTypesData = await jobTypeService.getActiveJobTypes(db, accountID);

    const activeJobTypesData = {
      jobTypesData,
      grid: createGrid(jobTypesData)
    };

    res.send({
      jobTypesList: { activeJobTypesData },
      message: 'Successfully deleted jobType.',
      status: 200
    });
  });

module.exports = jobTypeRouter;
