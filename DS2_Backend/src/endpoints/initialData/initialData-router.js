const express = require('express');
const initialDataRouter = express.Router();
const customerService = require('../customer/customer-service');
const invoiceService = require('../invoice/invoice-service');
const transactionsService = require('../transactions/transactions-service');
const jobService = require('../job/job-service');
const recurringCustomerService = require('../recurringCustomer/recurringCustomer-service');
const retainerService = require('../retainer/retainer-service');
const accountUserService = require('../user/user-service');
const jobCategoriesService = require('../jobCategories/jobCategories-service');
const jobTypeService = require('../jobType/jobType-service');
const writeOffsService = require('../writeOffs/writeOffs-service');
const paymentsService = require('../payments/payments-service');
const workDescriptionService = require('../workDescriptions/workDescriptions-service');
const { createGrid, generateTreeGridData } = require('../../helperFunctions/helperFunctions');
const createJobReturnObject = require('../job/jobJsonObjects');
const createJobTypeReturnObject = require('../jobType/jobTypeJsonObjects');
const createJobCategoryReturnObject = require('../jobCategories/jobCategoryJsonObjects');
const createPaymentReturnObject = require('../payments/paymentJsonObjects');
const createWorkDescriptionReturnObject = require('../workDescriptions/workDescriptionsJsonObjects');

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
   const [
      activeCustomers,
      activeRecurringCustomers,
      activeUsers,
      activeTransactions,
      activeInvoices,
      activeJobs,
      activeJobCategories,
      jobTypesData,
      activeWriteOffs,
      activePayments,
      activeRetainers,
      workDescriptions
   ] = await Promise.all([
      customerService.getActiveCustomers(db, accountID),
      recurringCustomerService.getActiveRecurringCustomers(db, accountID),
      accountUserService.getActiveAccountUsers(db, accountID),
      transactionsService.getActiveTransactions(db, accountID),
      invoiceService.getInvoices(db, accountID),
      jobService.getActiveJobs(db, accountID),
      jobCategoriesService.getActiveJobCategories(db, accountID),
      jobTypeService.getActiveJobTypes(db, accountID),
      writeOffsService.getActiveWriteOffs(db, accountID),
      paymentsService.getActivePayments(db, accountID),
      retainerService.getActiveRetainers(db, accountID),
      workDescriptionService.getActiveWorkDescriptions(db, accountID)
   ]);

   const activeCustomerData = {
      activeCustomers,
      grid: createGrid(activeCustomers)
   };

   const activeRecurringCustomersData = {
      activeRecurringCustomers,
      grid: createGrid(activeRecurringCustomers)
   };

   const activeUserData = {
      activeUsers,
      grid: createGrid(activeUsers)
   };

   const activeTransactionsData = {
      activeTransactions,
      grid: createGrid(activeTransactions)
   };

   const activeInvoiceData = {
      activeInvoices,
      grid: createGrid(activeInvoices),
      treeGrid: generateTreeGridData(activeInvoices, 'customer_invoice_id', 'parent_invoice_id')
   };

   const activeJobData = createJobReturnObject.activeJobData(activeJobs);

   const activeJobCategoriesData = createJobCategoryReturnObject.activeJobCategoriesData(activeJobCategories);

   const activeJobTypesData = createJobTypeReturnObject.activeJobTypesData(jobTypesData);

   const activePaymentsData = createPaymentReturnObject.activePaymentsData(activePayments);

   const activeWriteOffsData = {
      activeWriteOffs,
      grid: createGrid(activeWriteOffs)
   };

   const activeRetainerData = {
      activeRetainers,
      grid: createGrid(activeRetainers),
      treeGrid: generateTreeGridData(activeRetainers, 'retainer_id', 'parent_retainer_id')
   };

   const activeWorkDescriptionsData = createWorkDescriptionReturnObject.activeWorkDescriptionsData(workDescriptions);

   res.send({
      customersList: { activeCustomerData },
      recurringCustomersList: { activeRecurringCustomersData },
      teamMembersList: { activeUserData },
      transactionsList: { activeTransactionsData },
      invoicesList: { activeInvoiceData },
      accountJobsList: { activeJobData },
      jobCategoriesList: { activeJobCategoriesData },
      jobTypesList: { activeJobTypesData },
      writeOffsList: { activeWriteOffsData },
      paymentsList: { activePaymentsData },
      accountRetainersList: { activeRetainerData },
      workDescriptionsList: { activeWorkDescriptionsData },
      message: 'Successfully Retrieved Data.',
      status: 200
   });
};
