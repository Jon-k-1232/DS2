const { createGrid, generateTreeGridData } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createRetainerReturnObject = {
   activeRetainerData: activeRetainers => ({
      activeRetainers,
      grid: createGrid(activeRetainers),
      treeGrid: generateTreeGridData(activeRetainers, 'retainer_id', 'parent_retainer_id')
   })
};

module.exports = createRetainerReturnObject;
