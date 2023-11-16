const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createWorkDescriptionReturnObject = {
   activeWorkDescriptionsData: workDescriptionsData => ({
      workDescriptionsData,
      grid: createGrid(workDescriptionsData)
   })
};

module.exports = createWorkDescriptionReturnObject;
