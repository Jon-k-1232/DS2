const express = require('express');
const jobRouter = express.Router();
const jobService = require('./job-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const { restoreDataTypesJobTableOnCreate, restoreDataTypesJobTableOnUpdate } = require('./jobObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const dayjs = require('dayjs');

// Create a new job
jobRouter
  .route('/createJob/:accountID/:userID')
  // .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedNewJob = sanitizeFields(req.body.job);

    // Create new object with sanitized fields
    const jobTableFields = restoreDataTypesJobTableOnCreate(sanitizedNewJob);

    // Post new job
    await jobService.createJob(db, jobTableFields);

    // Get all jobs
    const activeJobs = await jobService.getActiveJobs(db, jobTableFields.account_id);

    const activeJobData = {
      activeJobs,
      grid: createGrid(activeJobs)
    };

    res.send({
      accountJobsList: { activeJobData },
      message: 'Successfully created new job.',
      status: 200
    });
  });

// Get job for a company
jobRouter
  .route('/getSingleJob/:customerJobID/:accountID/:userID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { customerJobID } = req.params;

    const activeJobs = await jobService.getSingleJob(db, customerJobID);

    const activeJobData = {
      activeJobs,
      grid: createGrid(activeJobs)
    };

    res.send({
      activeJobData,
      message: 'Successfully retrieved single job.',
      status: 200
    });
  });

// Get all active jobs for a customer
jobRouter
  .route('/getActiveCustomerJobs/:accountID/:userID/:customerID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, customerID } = req.params;

    const customerJobs = await jobService.getActiveCustomerJobs(db, accountID, customerID);

    const activeCustomerJobs = findMostRecentJobRecords(customerJobs);

    // Return Object
    const activeCustomerJobData = {
      activeCustomerJobs,
      grid: createGrid(activeCustomerJobs)
    };

    res.send({
      activeCustomerJobData,
      message: 'Successfully retrieved active customer jobs.',
      status: 200
    });
  });

// Get all active jobs
jobRouter
  .route('/getActiveJobs/:accountID/:userID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;

    const activeJobs = await jobService.getActiveJobs(db, accountID);

    // Return Object
    const activeJobData = {
      activeJobs,
      grid: createGrid(activeJobs)
    };

    res.send({
      activeJobData,
      message: 'Successfully retrieved active jobs.',
      status: 200
    });
  });

// Update a job
jobRouter
  .route('/updateJob')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedUpdatedJob = sanitizeFields(req.body.job);

    // Create new object with sanitized fields
    const jobTableFields = restoreDataTypesJobTableOnUpdate(sanitizedUpdatedJob);

    // Update job
    await jobService.updateJob(db, jobTableFields);

    // Get all jobs
    const jobsData = await jobService.getActiveJobs(db, jobTableFields.account_id);

    // Create grid for Mui Grid
    const grid = createGrid(jobsData);

    const job = {
      jobsData,
      grid
    };

    res.send({
      job,
      message: 'Successfully updated job.',
      status: 200
    });
  });

// Delete a job
jobRouter
  .route('/deleteJob/:jobID/:accountID/:userID')
  // .all(requireAuth)
  .delete(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { accountID, jobID } = req.params;

    // Delete job
    await jobService.deleteJob(db, jobID);

    // Get all jobs
    const activeJobs = await jobService.getActiveJobs(db, accountID);

    const activeJobData = {
      activeJobs,
      grid: createGrid(activeJobs)
    };

    res.send({
      accountJobsList: { activeJobData },
      message: 'Successfully deleted job.',
      status: 200
    });
  });

module.exports = jobRouter;

/**
 * Finds the most recent job record for each job, the returns an array of those most recent records
 * @param {*} jobs
 * @returns
 */
const findMostRecentJobRecords = jobs => {
  // Jobs array must be oldest to newest when coming in from db
  const mostRecentJobs = jobs.reduce((acc, curr) => {
    if (!acc[curr.parent_job_id]) acc[curr.customer_job_id] = curr;
    if (acc[curr.parent_job_id] && dayjs(curr.created_at).isAfter(dayjs(acc[curr.parent_job_id].created_at))) {
      acc[curr.parent_job_id] = curr;
    }

    return acc;
  }, {});

  return Object.values(mostRecentJobs);
};
