const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createWriteOffReturnObject = {
   activeWriteOffsData: activeWriteOffs => ({
      activeWriteOffs,
      grid: createGrid(activeWriteOffs)
   })
};

module.exports = createWriteOffReturnObject;
