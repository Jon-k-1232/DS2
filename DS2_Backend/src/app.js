require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('../config');
const ip = require('ip');
const app = express();
const customerRouter = require('./endpoints/customer/customer-router');
const transactions = require('./endpoints/transactions/transactions-router');
const user = require('./endpoints/user/user-router');
const company = require('./endpoints/job/job-router');
const invoices = require('./endpoints/invoice/invoice-router');
const authentication = require('./endpoints/auth/auth-router');
const jobCategoriesRouter = require('./endpoints/jobCategories/jobCategories-router');
const paymentsRouter = require('./endpoints/payments/payments-router');
const jobTypeRouter = require('./endpoints/jobType/jobType-router');
const quotesRouter = require('./endpoints/quotes/quotes-router');
const recurringCustomerRouter = require('./endpoints/recurringCustomer/recurringCustomer-router');
const config = require('../config');
const accountRouter = require('./endpoints/account/account-router');
const retainerRouter = require('./endpoints/retainer/retainer-router');
const writeOffsRouter = require('./endpoints/writeOffs/writeOffs-router');

// Middleware
app.use(
  morgan((tokens, req, res) => {
    const ipAddress = req.ip;
    const currentTime = new Date().toLocaleString();
    const responseTime = parseFloat(tokens['response-time'](req, res)).toFixed(3);
    const formattedResponseTime = responseTime.padStart(7, ' ').padEnd(10, '');
    const status = tokens.status(req, res);
    const method = tokens.method(req, res);
    const endpoint = tokens.url(req, res);
    return `[${currentTime}] - ${ipAddress} - ${method} - Status: ${status} - Response Time: ${formattedResponseTime}ms - ${endpoint}`;
  })
);

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: '*' }));

/* ///////////////////////////\\\\  KEY VALIDATION  ////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// app.use(
//   (validateBearerToken = (req, res, next) => {
//     const apiToken = config.API_TOKEN;
//     const authToken = req.get('BearerAuthorization');

//     if (!authToken || authToken !== apiToken) {
//       return res.send({
//         error: 'Unauthorized request',
//         status: 401
//       });
//     }
//     next();
//   })
// );

/* ///////////////////////////\\\\  USER ENDPOINTS  ////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/auth', authentication);
app.use('/customer', customerRouter);
app.use('/jobs', company);
app.use('/transactions', transactions);
app.use('/user', user);
app.use('/invoices', invoices);
app.use('/jobCategories', jobCategoriesRouter);
app.use('/account', accountRouter);
app.use('/jobTypes', jobTypeRouter);
app.use('/quotes', quotesRouter);
app.use('/payments', paymentsRouter);
app.use('/recurringCustomer', recurringCustomerRouter);
app.use('/retainers', retainerRouter);
app.use('/writeOffs', writeOffsRouter);

// ToDo - temp use for dev
app.use('/invoices', express.static('invoices'));

/* ///////////////////////////\\\\  ERROR HANDLER  ////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
