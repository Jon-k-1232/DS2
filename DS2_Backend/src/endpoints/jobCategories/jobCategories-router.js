const express = require('express');
const jobCategoriesRouter = express.Router();
const jobCategoriesService = require('./jobCategories-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { restoreDataTypesJobCategoriesOnCreate, restoreDataTypesJobCategoriesOnUpdate } = require('./jobCategoriesObjects');

// Get all active job categories
jobCategoriesRouter.route('/getActiveJobCategories/:accountID/:userID').get(async (req, res) => {
  const db = req.app.get('db');
  const { accountID } = req.params;

  const activeJobCategories = await jobCategoriesService.getActiveJobCategories(db, accountID);

  // Create Mui Grid
  const grid = createGrid(activeJobCategories);

  // Return Object
  const activeJobCategoriesData = {
    activeJobCategories,
    grid
  };

  res.send({
    activeJobCategoriesData,
    message: 'Successfully retrieved active job categories.',
    status: 200
  });
});

// Create a new job category
jobCategoriesRouter.route('/createJobCategory/:accountID/:userID').post(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const sanitizedNewJobCategory = sanitizeFields(req.body.jobCategory);

  // Create new object with sanitized fields
  const jobCategoriesTableFields = restoreDataTypesJobCategoriesOnCreate(sanitizedNewJobCategory);

  // Post new job category
  await jobCategoriesService.createJobCategory(db, jobCategoriesTableFields);

  // Get all Job Categories
  const activeJobCategories = await jobCategoriesService.getActiveJobCategories(db, jobCategoriesTableFields.account_id);

  const activeJobCategoriesData = {
    activeJobCategories,
    grid: createGrid(activeJobCategories)
  };

  res.send({
    jobCategoriesList: { activeJobCategoriesData },
    message: 'Successfully created job category.',
    status: 200
  });
});

// Update a job category
jobCategoriesRouter.route('/updateJobCategory/:accountID/:userID').put(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const sanitizedUpdatedJobCategory = sanitizeFields(req.body.jobCategory);

  // Create new object with sanitized fields
  const jobCategoriesTableFields = restoreDataTypesJobCategoriesOnUpdate(sanitizedUpdatedJobCategory);

  // Update the Job category
  await jobCategoriesService.updateJobCategory(db, jobCategoriesTableFields);

  // Get all Job Categories
  const activeJobCategories = await jobCategoriesService.getActiveJobCategories(db, jobCategoriesTableFields.account_id);

  const activeJobCategoriesData = {
    activeJobCategories,
    grid: createGrid(activeJobCategories)
  };

  res.send({
    jobCategoriesList: { activeJobCategoriesData },
    message: 'Successfully updated job category.',
    status: 200
  });
});

// Delete a job category
jobCategoriesRouter.route('/deleteJobCategory/:jobCategoryID/:accountID/:userID').delete(async (req, res) => {
  const db = req.app.get('db');
  const { jobCategoryID, accountID } = req.params;

  // Delete the Job category
  await jobCategoriesService.deleteJobCategory(db, jobCategoryID);

  // Get all Job Categories
  const jobCategoriesData = await jobCategoriesService.getActiveJobCategories(db, accountID);

  // Create grid for Mui Grid
  const grid = createGrid(jobCategoriesData);

  const jobCategory = {
    jobCategoriesData,
    grid
  };

  res.send({
    jobCategory,
    message: 'Successfully deleted job category.',
    status: 200
  });
});

// get single job category
jobCategoriesRouter.route('/getSingleJobCategory/:jobCategoryID/:accountID/:userID').get(async (req, res) => {
  const db = req.app.get('db');
  const { jobCategoryID } = req.params;

  const activeJobCategory = await jobCategoriesService.getSingleJobCategory(db, jobCategoryID);

  const activeJobCategoriesData = {
    activeJobCategory,
    grid: createGrid(activeJobCategory)
  };

  res.send({
    activeJobCategoriesData,
    message: 'Successfully retrieved job category.',
    status: 200
  });
});

module.exports = jobCategoriesRouter;
