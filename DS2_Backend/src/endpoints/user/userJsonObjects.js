const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createUserReturnObject = {
   activeUserData: activeUsers => ({
      activeUsers,
      grid: createGrid(activeUsers)
   })
};

module.exports = createUserReturnObject;
