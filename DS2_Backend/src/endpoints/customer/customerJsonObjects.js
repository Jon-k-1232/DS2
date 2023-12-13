const { createGrid, generateTreeGridData } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createCustomerReturnObject = {
   activeCustomerData: activeCustomers => ({
      activeCustomers,
      grid: createGrid(activeCustomers)
   }),

   customerData: customerContactData => ({
      customerData: customerContactData,
      grid: createGrid(customerContactData)
   })
};

module.exports = createCustomerReturnObject;
