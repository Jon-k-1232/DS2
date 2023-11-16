const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createPaymentReturnObject = {
   activePaymentsData: activePayments => ({
      activePayments,
      grid: createGrid(activePayments)
   })
};

module.exports = createPaymentReturnObject;
