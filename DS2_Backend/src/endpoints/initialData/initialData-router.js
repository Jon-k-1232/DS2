const express = require('express');
const initialDataRouter = express.Router();
const customerService = require('../customer/customer-service');
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

// Initial data object on app load
initialDataRouter.route('/initialBlob/:accountID/:userID').get(async (req, res) => {
  const db = req.app.get('db');
  const { accountID } = req.params;

  try {
    await initialData(db, res, accountID);
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while retrieving the initial data.',
      status: 500
    });
  }
});

module.exports = initialDataRouter;

const initialData = async (db, res, accountID) => {
  const services = [
    {
      service: customerService.getActiveCustomers,
      dataName: 'activeCustomers',
      listName: 'customersList',
      itemName: 'activeCustomerData'
    },
    {
      service: recurringCustomerService.getActiveRecurringCustomers,
      dataName: 'activeRecurringCustomers',
      listName: 'recurringCustomersList',
      itemName: 'activeRecurringCustomersData'
    },
    {
      service: accountUserService.getActiveAccountUsers,
      dataName: 'activeUsers',
      listName: 'teamMembersList',
      itemName: 'activeUserData'
    },
    {
      service: transactionsService.getActiveTransactions,
      dataName: 'activeTransactions',
      listName: 'transactionsList',
      itemName: 'activeTransactionsData'
    },
    { service: invoiceService.getInvoices, dataName: 'activeInvoices', listName: 'invoicesList', itemName: 'activeInvoiceData' },
    { service: quotesService.getActiveQuotes, dataName: 'activeQuotes', listName: 'quotesList', itemName: 'activeQuoteData' },
    { service: jobService.getActiveJobs, dataName: 'activeJobs', listName: 'accountJobsList', itemName: 'activeJobData' },
    {
      service: jobCategoriesService.getActiveJobCategories,
      dataName: 'activeJobCategories',
      listName: 'jobCategoriesList',
      itemName: 'activeJobCategoriesData'
    },
    { service: jobTypeService.getActiveJobTypes, dataName: 'jobTypesData', listName: 'jobTypesList', itemName: 'activeJobTypesData' },
    {
      service: writeOffsService.getActiveWriteOffs,
      dataName: 'activeWriteOffs',
      listName: 'writeOffsList',
      itemName: 'activeWriteOffsData'
    },
    { service: paymentsService.getActivePayments, dataName: 'activePayments', listName: 'paymentsList', itemName: 'activePaymentsData' },
    {
      service: retainerService.getActiveRetainers,
      dataName: 'activeRetainers',
      listName: 'accountRetainersList',
      itemName: 'activeRetainerData'
    }
  ];

  const results = await Promise.all(
    services.map(({ service, dataName, listName, itemName }) =>
      service(db, accountID).then(data => {
        return {
          [listName]: {
            [itemName]: {
              [dataName]: data,
              grid: createGrid(data)
            }
          }
        };
      })
    )
  );

  const responseData = Object.assign({}, ...results, {
    message: 'Success',
    status: 200
  });

  res.send(responseData);
};
