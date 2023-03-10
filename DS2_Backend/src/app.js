require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('../config');
const app = express();
const customerRouter = require('./endpoints/customer/customer-router');
const jobDescriptionRouter = require('./endpoints/jobDescriptions/jobDescriptions-router');
const payTo = require('./endpoints/payTo/payTo-router');
const transactions = require('./endpoints/customerTransactions/customerTransactions-router');
const user = require('./endpoints/user/user-router');
const company = require('./endpoints/job/job-router');
const invoices = require('./endpoints/invoice/invoice-router');
const authentication = require('./endpoints/auth/auth-router');
const retainerRouter = require('./endpoints/retainer/retainer-router');
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';
const config = require('../config');

//middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: '*'
  })
);

/* ///////////////////////////\\\\  KEY VALIDATION  ////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

app.use(
  (validateBearerToken = (req, res, next) => {
    const apiToken = config.API_TOKEN;
    const authToken = req.get('BearerAuthorization');

    if (!authToken || authToken !== apiToken) {
      return res.send({
        error: 'Unauthorized request',
        status: 401
      });
    }
    next();
  })
);

/* ///////////////////////////\\\\  USER ENDPOINTS  ////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/auth', authentication);
app.use('/customer', customerRouter);
app.use('/jobs', company);
app.use('/jobDescription', jobDescriptionRouter);
app.use('/payTo', payTo);
app.use('/transactions', transactions);
app.use('/user', user);
app.use('/invoices', invoices);
app.use('/retainer', retainerRouter);

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
