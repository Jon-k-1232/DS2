const express = require('express');
const jsonParser = express.json();
const customerRouter = express.Router();
const customerService = require('./customer-service');
const invoiceService = require('../invoice/invoice-service');
const transactionsService = require('../transactions/transactions-service');
const jobService = require('../job/job-service');
const recurringCustomerService = require('../recurringCustomer/recurringCustomer-service');
const retainerService = require('../retainer/retainer-service');
const accountUserService = require('../user/user-service');
const quotesService = require('../quotes/quotes-service');
const jobCategoriesService = require('../jobCategories/jobCategories-service');
const jobTypeService = require('../jobType/jobType-service');
const writeOffsService = require('../writeOffs/writeOffs-service');
const paymentsService = require('../payments/payments-service');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const {
  restoreDataTypesRecurringCustomerTableOnCreate,
  restoreDataTypesRecurringCustomerTableOnUpdate
} = require('../recurringCustomer/recurringCustomerObjects');
const {
  restoreDataTypesCustomersOnCreate,
  restoreDataTypesCustomersInformationOnCreate,
  restoreDataTypesCustomersOnUpdate,
  restoreDataTypesCustomersInformationOnUpdate
} = require('./customerObjects');
const dayjs = require('dayjs');

// Create New Customer
customerRouter
  .route('/createCustomer/:accountID/:userID')
  // .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedNewCustomer = sanitizeFields(req.body.customer);

    // Create new object with sanitized fields
    const customerTableFields = restoreDataTypesCustomersOnCreate(sanitizedNewCustomer);

    // Post new customer
    const customerData = await customerService.createCustomer(db, customerTableFields);

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
  });

// Get active customers
customerRouter
  .route('/activeCustomers/:accountID/:userID')
  // .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.params;

    // Get active customers
    const activeCustomers = await customerService.getActiveCustomers(db, accountID);

    // Create Mui Grid
    const grid = createGrid(activeCustomers);

    // Return Object
    const activeCustomerData = {
      activeCustomers,
      grid
    };

    res.send({
      activeCustomerData,
      message: 'Success',
      status: 200
    });
  });

// Get customer by ID, and all associated data for customer profile
customerRouter
  .route('/activeCustomers/customerByID/:accountID/:userID/:customerID')
  // .all( requireAuth )
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID, customerID } = req.params;

    const services = [
      { service: customerService.getCustomerByID, name: 'customerData' },
      { service: retainerService.getCustomerRetainersByID, name: 'customerRetainerData' },
      { service: invoiceService.getCustomerInvoiceByID, name: 'customerInvoiceData' },
      { service: transactionsService.getCustomerTransactionsByID, name: 'customerTransactionData' },
      { service: jobService.getActiveCustomerJobs, name: 'customerJobData' }
    ];

    const results = await Promise.all(
      services.map(({ service, name }) =>
        service(db, accountID, customerID).then(data => ({
          [name]: {
            grid: createGrid(data),
            [name]: data
          }
        }))
      )
    );

    const responseData = Object.assign({}, ...results, {
      message: 'Success',
      status: 200
    });

    res.send(responseData);
  });

// Update Customer
customerRouter
  .route('/updateCustomer/:accountID/:userID')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');

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
  });

// Update Customer Information table
customerRouter
  .route('/updateCustomerInformation')
  // .all(requireAuth)
  .put(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const sanitizedUpdatedCustomerInformation = sanitizeFields(req.body.customer);

    const { account_id } = sanitizedUpdatedCustomerInformation;
    const customerInfoTableFields = restoreDataTypesCustomersInformationOnUpdate(sanitizedUpdatedCustomerInformation);
    await customerService.updateCustomerInformation(db, customerInfoTableFields);

    const activeCustomers = await customerService.getActiveCustomers(db, account_id);

    const grid = createGrid(activeCustomers);

    const customer = {
      activeCustomers,
      grid
    };

    res.send({
      customer,
      message: 'Successfully updated customer information.',
      status: 200
    });
  });

// Delete Customer
customerRouter
  .route('/deleteCustomer/:customerID/:accountID')
  // .all(requireAuth)
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

module.exports = customerRouter;
