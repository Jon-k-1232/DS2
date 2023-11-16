const { createGrid, generateTreeGridData } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createJobReturnObject = {
   // activeJobData
   activeJobData: activeJobs => ({
      activeJobs,
      grid: createGrid(activeJobs),
      treeGrid: generateTreeGridData(activeJobs, 'customer_job_id', 'parent_job_id')
   }),

   // activeCustomerJobData
   activeCustomerJobData: activeCustomerJobs => ({
      activeCustomerJobs,
      grid: createGrid(activeCustomerJobs),
      treeGrid: generateTreeGridData(activeCustomerJobs, 'customer_job_id', 'parent_job_id')
   })
};

module.exports = createJobReturnObject;
