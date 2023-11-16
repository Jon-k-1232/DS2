const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createJobCategoryReturnObject = {
   activeJobCategoriesData: activeJobCategories => ({
      activeJobCategories,
      grid: createGrid(activeJobCategories)
   })
};

module.exports = createJobCategoryReturnObject;
