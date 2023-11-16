const express = require('express');
const jobRouter = express.Router();
const jobService = require('./job-service');
const transactionsService = require('../transactions/transactions-service');
const writeOffsService = require('../writeOffs/writeOffs-service');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { restoreDataTypesJobTableOnCreate, restoreDataTypesJobTableOnUpdate } = require('./jobObjects');
const { findMostRecentJobRecords } = require('../../helperFunctions/helperFunctions');
const createJobReturnObject = require('../job/jobJsonObjects');

// Create a new job
jobRouter.route('/createJob/:accountID/:userID').post(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   const { accountID } = req.params;

   try {
      const sanitizedNewJob = sanitizeFields(req.body.job);
      // Create new object with sanitized fields
      const jobTableFields = restoreDataTypesJobTableOnCreate(sanitizedNewJob);

      // Check for duplicate job
      const duplicateJob = await jobService.findDuplicateJob(db, jobTableFields);
      if (duplicateJob.length) throw new Error('Duplicate job');

      // Post new job
      await jobService.createJob(db, jobTableFields);
      await sendUpdatedTableWith200Response(db, res, accountID);
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'Error creating job.',
         status: 500
      });
   }
});

// Get job for a company
jobRouter.route('/getSingleJob/:customerJobID/:accountID/:userID').get(async (req, res) => {
   const db = req.app.get('db');
   const { customerJobID } = req.params;

   const activeJobs = await jobService.getSingleJob(db, customerJobID);

   const activeJobData = createJobReturnObject.activeJobData(activeJobs);

   res.send({
      activeJobData,
      message: 'Successfully retrieved single job.',
      status: 200
   });
});

// Get all active jobs for a customer
jobRouter.route('/getActiveCustomerJobs/:accountID/:userID/:customerID').get(async (req, res) => {
   const db = req.app.get('db');
   const { accountID, customerID } = req.params;

   const customerJobs = await jobService.getActiveCustomerJobs(db, accountID, customerID);

   const activeCustomerJobs = findMostRecentJobRecords(customerJobs);

   // Add display_name field for autocomplete
   activeCustomerJobs.forEach(job => (job.display_name = `${job.job_description} - ${job.customer_job_category}`));

   const activeCustomerJobData = createJobReturnObject.activeCustomerJobData(activeCustomerJobs);

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

      // getSingleJob returns only one object within an array. Destructure that array.
      const [jobRowBeforeEdits] = await jobService.getSingleJob(db, jobTableFields.customer_job_id);

      if (jobTableFields.is_job_complete !== jobRowBeforeEdits.is_job_complete) {
         // Toggle job completion
         await jobService.toggleJobCompletion(db, jobTableFields);
      }

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
      const linkedTransactions = await transactionsService.getTransactionsByJobID(db, accountID, jobID);
      if (linkedTransactions.length) throw new Error('Transactions are linked to job: ' + error.message);

      const linkedWriteOffs = await writeOffsService.getWriteOffsByJobID(db, accountID, jobID);
      if (linkedWriteOffs.length) throw new Error('Write offs are linked to job: ' + error.message);

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
 * Standard return for jobs
 * @param {*} db
 * @param {*} res
 * @param {*} accountID
 */
const sendUpdatedTableWith200Response = async (db, res, accountID) => {
   // Get all jobs
   const activeJobs = await jobService.getActiveJobs(db, accountID);

   const activeJobData = createJobReturnObject.activeJobData(activeJobs);

   res.send({
      accountJobsList: { activeJobData },
      message: 'Successfully created new job.',
      status: 200
   });
};
