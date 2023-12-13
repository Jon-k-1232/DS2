const { createGrid } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createRecurringCustomerReturnObject = {
   activeRecurringCustomersData: activeRecurringCustomers => ({
      activeRecurringCustomers,
      grid: createGrid(activeRecurringCustomers)
   }),

   recurringCustomer: recurringCustomersData => ({
      recurringCustomersData,
      grid: createGrid(recurringCustomersData)
   })
};

module.exports = createRecurringCustomerReturnObject;
