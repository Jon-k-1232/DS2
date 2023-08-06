const express = require('express');
const jobRouter = express.Router();
const jobService = require('./job-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { restoreDataTypesJobTableOnCreate, restoreDataTypesJobTableOnUpdate } = require('./jobObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const dayjs = require('dayjs');

// Create a new job
jobRouter.route('/createJob/:accountID/:userID').post(jsonParser, async (req, res) => {
  const db = req.app.get('db');

  try {
    const sanitizedNewJob = sanitizeFields(req.body.job);
    // Create new object with sanitized fields
    const jobTableFields = restoreDataTypesJobTableOnCreate(sanitizedNewJob);
    // Post new job
    await jobService.createJob(db, jobTableFields);
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while creating the Job.',
      status: 500
    });
  }
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

// Update a job
jobRouter.route('/updateJob/:accountID/:userID').put(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const { accountID } = req.params;

  try {
    const sanitizedUpdatedJob = sanitizeFields(req.body.job);
    // Create new object with sanitized fields
    const jobTableFields = restoreDataTypesJobTableOnUpdate(sanitizedUpdatedJob);
    // Update job
    await jobService.updateJob(db, jobTableFields);
    await sendUpdatedTableWith200Response(db, res, accountID);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message || 'An error occurred while updating the Job.',
      status: 500
    });
  }
});

// Delete a job
jobRouter.route('/deleteJob/:jobID/:accountID/:userID').delete(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const { accountID, jobID } = req.params;

  try {
    // Delete job
    await jobService.deleteJob(db, jobID);
    await sendUpdatedTableWith200Response(db, res, accountID);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message || 'An error occurred while updating the Job.',
      status: 500
    });
  }
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

const sendUpdatedTableWith200Response = async (db, res, accountID) => {
  // Get all jobs
  const activeJobs = await jobService.getActiveJobs(db, accountID);

  const activeJobData = {
    activeJobs,
    grid: createGrid(activeJobs)
  };

  res.send({
    accountJobsList: { activeJobData },
    message: 'Successfully created new job.',
    status: 200
  });
};
