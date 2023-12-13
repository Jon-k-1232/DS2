const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createWorkDescriptionReturnObject = {
   activeWorkDescriptionsData: workDescriptions => ({
      workDescriptions,
      grid: createGrid(workDescriptions)
   }),

   singleWorkDescriptionsData: workDescriptionData => ({
      workDescriptionData,
      grid: createGrid(workDescriptionData)
   })
};

module.exports = createWorkDescriptionReturnObject;
