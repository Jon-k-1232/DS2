const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createJobTypeReturnObject = {
   // activeJobTypesData
   activeJobTypesData: jobTypesData => ({
      jobTypesData,
      grid: createGrid(jobTypesData)
   })
};

module.exports = createJobTypeReturnObject;
