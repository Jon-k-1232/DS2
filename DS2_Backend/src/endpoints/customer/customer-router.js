const express = require('express');
const jsonParser = express.json();
const customerRouter = express.Router();
const customerService = require('./customer-service');
const invoiceService = require('../invoice/invoice-service');
const transactionsService = require('../transactions/transactions-service');
const jobService = require('../job/job-service');
const recurringCustomerService = require('../recurringCustomer/recurringCustomer-service');
const retainerService = require('../retainer/retainer-service');
const { createGrid, generateTreeGridData } = require('../../helperFunctions/helperFunctions');
const { sanitizeFields } = require('../../utils');
const { requireManagerOrAdmin } = require('../auth/jwt-auth');
const { restoreDataTypesRecurringCustomerTableOnCreate, restoreDataTypesRecurringCustomerTableOnUpdate } = require('../recurringCustomer/recurringCustomerObjects');
const {
   restoreDataTypesCustomersOnCreate,
   restoreDataTypesCustomersInformationOnCreate,
   restoreDataTypesCustomersOnUpdate,
   restoreDataTypesCustomersInformationOnUpdate
} = require('./customerObjects');
const dayjs = require('dayjs');

// Create New Customer
customerRouter.route('/createCustomer/:accountID/:userID').post(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   const sanitizedNewCustomer = sanitizeFields(req.body.customer);

   try {
      // Create new object with sanitized fields
      const customerTableFields = restoreDataTypesCustomersOnCreate(sanitizedNewCustomer);

      // Post new customer
      const customerData = await customerService.createCustomer(db, customerTableFields);

      if (Object.keys(customerData).length) throw new Error('Error creating customer');

      // Need the customer number to post to customer_information table, then merge customer to sanitizedData, then insert
      const { customer_id, account_id } = customerData;
      const updatedWithCustomerID = { ...sanitizedNewCustomer, customer_id };
      const customerInfoTableFields = restoreDataTypesCustomersInformationOnCreate(updatedWithCustomerID);

      // Post new customer information
      await customerService.createCustomerInformation(db, customerInfoTableFields);

      // Check for recurring customer
      if (customerTableFields.is_recurring) {
         const recurringCustomerTableFields = restoreDataTypesRecurringCustomerTableOnCreate(sanitizedNewCustomer, customer_id);
         await recurringCustomerService.createRecurringCustomer(db, recurringCustomerTableFields);
      }

      // call active customers
      const activeCustomers = await customerService.getActiveCustomers(db, account_id);
      const activeRecurringCustomers = await recurringCustomerService.getActiveRecurringCustomers(db, account_id);

      const activeCustomerData = {
         activeCustomers,
         grid: createGrid(activeCustomers)
      };

      const activeRecurringCustomersData = {
         activeRecurringCustomers,
         grid: createGrid(activeRecurringCustomers)
      };

      res.send({
         customersList: { activeCustomerData },
         recurringCustomersList: { activeRecurringCustomersData },
         message: 'Successfully created customer.',
         status: 200
      });
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'An error occurred while creating the Retainer.',
         status: 500
      });
   }
});

// Get customer by ID, and all associated data for customer profile
customerRouter.route('/activeCustomers/customerByID/:accountID/:userID/:customerID').get(async (req, res) => {
   const db = req.app.get('db');
   const { accountID, customerID } = req.params;

   const customerContactData = await customerService.getCustomerByID(db, accountID, customerID);
   const customerRetainers = await retainerService.getCustomerRetainersByID(db, accountID, customerID);
   const customerInvoices = await invoiceService.getCustomerInvoiceByID(db, accountID, customerID);
   const customerTransactions = await transactionsService.getCustomerTransactionsByID(db, accountID, customerID);
   const customerJobs = await jobService.getActiveCustomerJobs(db, accountID, customerID);

   const customerData = {
      customerData: customerContactData,
      grid: createGrid(customerContactData)
   };

   const customerRetainerData = {
      customerRetainers,
      grid: createGrid(customerRetainers),
      treeGrid: generateTreeGridData(customerRetainers, 'retainer_id', 'parent_retainer_id')
   };

   const customerInvoiceData = {
      customerInvoices,
      grid: createGrid(customerInvoices),
      treeGrid: generateTreeGridData(customerInvoices, 'customer_invoice_id', 'parent_invoice_id')
   };

   const customerTransactionData = {
      customerTransactions,
      grid: createGrid(customerTransactions)
   };

   const customerJobData = {
      customerJobs,
      grid: createGrid(customerJobs),
      treeGrid: generateTreeGridData(customerJobs, 'customer_job_id', 'parent_job_id')
   };

   res.send({
      customerData,
      customerRetainerData,
      customerInvoiceData,
      customerTransactionData,
      customerJobData,
      message: 'Successfully Retrieved Data.',
      status: 200
   });
});

// Update Customer
customerRouter.route('/updateCustomer/:accountID/:userID').put(jsonParser, async (req, res) => {
   const db = req.app.get('db');
   try {
      const sanitizedUpdatedCustomer = sanitizeFields(req.body.customer);
      const { customerID, accountID } = sanitizedUpdatedCustomer;

      // Restore data types and map to DB fields
      const customerTableFields = restoreDataTypesCustomersOnUpdate(sanitizedUpdatedCustomer);
      const customerInfoTableFields = restoreDataTypesCustomersInformationOnUpdate(sanitizedUpdatedCustomer);
      const createRecurringCustomerTableFields = restoreDataTypesRecurringCustomerTableOnCreate(sanitizedUpdatedCustomer, customerID);
      const updateRecurringCustomerTableFields = restoreDataTypesRecurringCustomerTableOnUpdate(sanitizedUpdatedCustomer, customerID);

      // Post new customer information
      await customerService.updateCustomer(db, customerTableFields);
      await customerService.updateCustomerInformation(db, customerInfoTableFields);

      // Condition: Adding customer to recurring
      if (sanitizedUpdatedCustomer.isCustomerRecurring && !sanitizedUpdatedCustomer.recurringCustomerID) {
         await recurringCustomerService.createRecurringCustomer(db, createRecurringCustomerTableFields);
         // Condition: Customer is recurring but will need deactivated
      } else if (!sanitizedUpdatedCustomer.isCustomerRecurring && sanitizedUpdatedCustomer.recurringCustomerID > 0) {
         const addedEndDate = { ...updateRecurringCustomerTableFields, end_date: dayjs().format(), is_recurring_customer_active: false };
         await recurringCustomerService.deleteRecurringCustomer(db, addedEndDate);
         // Condition: Customer is recurring and needs info updated
      } else if (sanitizedUpdatedCustomer.isCustomerRecurring && sanitizedUpdatedCustomer.recurringCustomerID > 0) {
         await recurringCustomerService.updateRecurringCustomer(db, updateRecurringCustomerTableFields);
      }

      // Call active customers
      const activeCustomers = await customerService.getActiveCustomers(db, accountID);
      const activeRecurringCustomers = await recurringCustomerService.getActiveRecurringCustomers(db, accountID);

      const activeCustomerData = {
         activeCustomers,
         grid: createGrid(activeCustomers)
      };

      const activeRecurringCustomersData = {
         activeRecurringCustomers,
         grid: createGrid(activeRecurringCustomers)
      };

      res.send({
         customersList: { activeCustomerData },
         recurringCustomersList: { activeRecurringCustomersData },
         message: 'Successfully updated customer.',
         status: 200
      });
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'An error occurred while creating the Retainer.',
         status: 500
      });
   }
});

// Delete Customer
customerRouter
   .route('/deleteCustomer/:customerID/:accountID')
   .all(requireManagerOrAdmin)
   .delete(jsonParser, async (req, res) => {
      const db = req.app.get('db');
      const { customerID, accountID } = req.params;

      // delete customer
      await customerService.deleteCustomer(db, customerID);

      // call active customers
      const activeCustomers = await customerService.getActiveCustomers(db, accountID);

      const grid = createGrid(activeCustomers);

      const customer = {
         activeCustomers,
         grid
      };

      res.send({
         customer,
         message: 'Successfully deleted customer.',
         status: 200
      });
   });

customerRouter
   .route('/disableCustomer/:customerID/:accountID/:userID')
   .all(requireManagerOrAdmin)
   .put(jsonParser, async (req, res) => {
      const db = req.app.get('db');
      const { customerID, accountID } = req.params;

      // disable customer
      await customerService.disableCustomer(db, accountID, customerID);

      // call active customers
      const activeCustomers = await customerService.getActiveCustomers(db, accountID);

      const activeCustomerData = {
         activeCustomers,
         grid: createGrid(activeCustomers)
      };

      res.send({
         customersList: { activeCustomerData },
         message: 'Successfully deleted customer.',
         status: 200
      });
   });

module.exports = customerRouter;
