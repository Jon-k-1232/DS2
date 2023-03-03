const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const { requireAuth } = require('../auth/jwt-auth');
const customerRouter = express.Router();
const customerService = require('./customer-service');
const customerHelpers = require('./customerHelpers');

/**
 * Gets active contacts
 */
customerRouter
  .route('/accountCustomers')
  .all(requireAuth)
  .get(async (req, res) => {
    const db = req.app.get('db');
    const { accountID } = req.body;

    const sanitizedFields = sanitizeFields({ accountID });
    const sanitizedAccountID = Number(sanitizedFields.accountID);

    const activeCustomers = await customerService.getActiveAccountCustomers(db, sanitizedAccountID);
    const priorCustomers = await customerService.getPriorCustomers(db, sanitizedAccountID);
    const allCustomers = await customerService.getAllCustomers(db, sanitizedAccountID);

    res.send({
      activeCustomers,
      priorCustomers,
      allCustomers,
      message: 'Success',
      status: 200
    });
  });

/**
 * Deactivates a customer
 */
customerRouter
  .route('/deactivateAccount')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const { customerID, accountID } = req.body;

    const sanitizedFields = sanitizeFields({ customerID, accountID });
    const sanitizedCustomerID = Number(sanitizedFields.customerID);
    const sanitizedAccountID = Number(sanitizedFields.accountID);

    const updatedCustomer = await customerService.deactivateCustomer(db, sanitizedCustomerID, sanitizedAccountID);

    res.send({
      updatedCustomer,
      message: 'Customer deactivated',
      status: 200
    });
  });

/**
 * Adds a new contact
 */
customerRouter
  .route('/newCustomer/:isNewCustomerInformationRecordOnly')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const isNewCustomerInformationRecordOnly = Boolean(req.params.isNewCustomerInformationRecordOnlyy);
    const {
      accountID,
      customerID,
      isCustomerActive,
      isCustomerBillable,
      isCustomerRecurring,
      billingCycle,
      cycleDay,
      customerName,
      customerFirstName,
      customerLastName,
      customerStreet,
      customerCity,
      customerState,
      customerZip,
      customerPhone,
      customerEmail,
      isCustomerAddressActive,
      isCustomerPhysicalAddress,
      isCustomerBillingAddress,
      isCustomerMailingAddress
    } = req.body;

    const cleanedFields = sanitizeFields({
      accountID,
      customerID,
      isCustomerActive,
      isCustomerBillable,
      isCustomerRecurring,
      billingCycle,
      cycleDay,
      customerName,
      customerFirstName,
      customerLastName,
      customerStreet,
      customerCity,
      customerState,
      customerZip,
      customerPhone,
      customerEmail,
      isCustomerAddressActive,
      isCustomerPhysicalAddress,
      isCustomerBillingAddress,
      isCustomerMailingAddress
    });

    // Note: Based on tables, a customer can have multiple address in customerInformation, mailing, physical, billing, yet only a single customer record.

    // If new address only, insert new customer information record only, if false then new customer AND new customer information
    if (isNewCustomerInformationRecordOnly) {
      const { customerID } = cleanedFields;
      // Get customer information object
      const customerInformation = customerHelpers.formNewCustomerInformationObject(cleanedFields, customerID);
      // Insert newCustomerInformation
      await customerService.insertNewCustomerInformation(db, customerInformation);
    } else {
      // Insert new customer, calls fx that creates new customer record, and new customer information record
      await insertNewCustomer(cleanedFields);
    }

    // Get all active customers
    const activeCustomers = await customerService.getActiveAccountCustomers(db, Number(cleanedFields.accountID));

    res.send({
      activeCustomers,
      message: 'Successfully added new customer',
      status: 200
    });
  });

/**
 * Updates a user specified user. Param is integer
 */
customerRouter
  .route('/updateCustomer')
  .all(requireAuth)
  .post(jsonParser, async (req, res) => {
    const db = req.app.get('db');
    const {
      accountID,
      customerID,
      isCustomerActive,
      isCustomerBillable,
      isCustomerRecurring,
      billingCycle,
      cycleDay,
      customerName,
      customerFirstName,
      customerLastName,
      customerStreet,
      customerCity,
      customerState,
      customerZip,
      customerPhone,
      customerEmail,
      isCustomerAddressActive,
      isCustomerPhysicalAddress,
      isCustomerBillingAddress,
      isCustomerMailingAddress
    } = req.body;

    const cleanedFields = sanitizeFields({
      accountID,
      customerID,
      isCustomerActive,
      isCustomerBillable,
      isCustomerRecurring,
      billingCycle,
      cycleDay,
      customerName,
      customerFirstName,
      customerLastName,
      customerStreet,
      customerCity,
      customerState,
      customerZip,
      customerPhone,
      customerEmail,
      isCustomerAddressActive,
      isCustomerPhysicalAddress,
      isCustomerBillingAddress,
      isCustomerMailingAddress
    });

    // Calls Fx to update customer and customer information
    const updatedCustomer = await updateCustomer(cleanedFields);

    res.send({
      updatedCustomer,
      message: 'Successfully updated customer.',
      status: 200
    });
  });

module.exports = customerRouter;

/**
 * Update customer
 * @param {*} sanitizeFields
 * @returns  {Object} newInsertedCustomer
 */
const updateCustomer = async sanitizeFields => {
  const customerObject = customerHelpers.formNewCustomerObject(sanitizeFields);
  const customerInformationObject = customerHelpers.formNewCustomerInformationObject(sanitizeFields, customerID);
  const customerID = sanitizeFields.customerID;
  const accountID = sanitizeFields.accountID;

  // Insert the update customer
  const insertedCustomer = await customerService.updateCustomer(db, customerObject, customerID, accountID);

  // Insert new customer information
  const insertedCustomerInformation = await customerService.updateCustomerInformation(db, customerInformationObject, customerID, accountID);

  // Combine new customer and new customer information and return
  return { ...insertedCustomer, ...insertedCustomerInformation };
};

/**
 * Inserts new customer
 * @param {*} sanitizeFields
 * @returns  {Object} newInsertedCustomer
 */
const insertNewCustomer = async sanitizeFields => {
  // Form new customer
  const customerObject = customerHelpers.formNewCustomerObject(sanitizeFields);

  // Insert new customer
  const newInsertedCustomer = await customerService.insertNewContact(db, customerObject);

  // Get customerID from newInsertedCustomer in order to relate tables
  const customerID = newInsertedCustomer[0].customerID;

  // Form new customer information
  const newCustomerInformationObject = customerHelpers.formNewCustomerInformationObject(sanitizeFields, customerID);

  // Insert new customer information
  const newInsertedCustomerInformation = await customerService.insertNewCustomerInformation(db, newCustomerInformationObject);

  // Combine new customer and new customer information and return
  return { ...newInsertedCustomer, ...newInsertedCustomerInformation };
};
