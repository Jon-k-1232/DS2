import axios from 'axios';
import config from '../../config';

export const getCustomersList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/customer/activeCustomers/${accountID}/${userID}`);
    const customersList = response.data;
    return customersList;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return [];
  }
};

export const getJobsCategoriesList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobCategories/getActiveJobCategories/${accountID}/${userID}`);
    const jobsCategoriesList = response.data;
    return jobsCategoriesList;
  } catch (error) {
    console.error('Error fetching job categories data:', error);
    return [];
  }
};

export const getJobTypesList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobTypes/getActiveJobTypes/${accountID}/${userID}`);
    const jobTypesList = response.data;
    return jobTypesList;
  } catch (error) {
    console.error('Error fetching job types data:', error);
    return [];
  }
};

export const getAccountJobsList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobs/getActiveJobs/${accountID}/${userID}`);
    const jobsList = response.data;
    return jobsList;
  } catch (error) {
    console.error('Error fetching account jobs data:', error);
    return [];
  }
};

export const getTransactionsList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/transactions/getActiveTransactions/${accountID}/${userID}`);
    const transactionsList = response.data;
    return transactionsList;
  } catch (error) {
    console.error('Error fetching transactions data:', error);
    return [];
  }
};

export const getTeamList = async () => {
  // const response = await axios.get('/team');
  //const teamList = response.data;
  const teamList = [];
  return teamList;
};

export const getTeamMembersList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/user/accountUsers/${accountID}/${userID}`);
    const teamMembersList = response.data;
    return teamMembersList;
  } catch (error) {
    console.error('Error fetching team members data:', error);
    return [];
  }
};

export const getInvoicesList = async (accountID, invoiceID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/invoices/getInvoices/${accountID}/${invoiceID}`);
    const invoicesList = response.data;
    return invoicesList;
  } catch (error) {
    console.error('Error fetching invoices data:', error);
    return [];
  }
};

export const getQuotesList = async (accountID, quoteID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/quotes/getActiveQuotes/${accountID}/${quoteID}`);
    const quotesList = response.data;
    return quotesList;
  } catch (error) {
    console.error('Error fetching quotes data:', error);
    return [];
  }
};

export const getAccountUsersList = async () => {
  // const response = await axios.get('/accountUsers');
  //const accountUsersList = response.data;
  const accountUsersList = [];
  return accountUsersList;
};

export const getRecurringCustomersList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/recurringCustomer/getActiveRecurringCustomers/${accountID}/${userID}`);
    const customersList = response.data;
    return customersList;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return [];
  }
};

export const getRoleList = async () => {
  // const response = await axios.get('/roles');
  //const roleList = response.data;
  const roleList = [];
  return roleList;
};

export const getAccessLevelList = async () => {
  // const response = await axios.get('/accessLevels');
  //const accessLevelList = response.data;
  const accessLevelList = [];
  return accessLevelList;
};

export const getCustomerJobsList = async (accountID, userID, customerID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobs/getActiveCustomerJobs/${accountID}/${userID}/${customerID}`);
    const customerJobsList = response.data;
    return customerJobsList;
  } catch (error) {
    console.error('Error fetching customer jobs data:', error);
    return [];
  }
};

export const getInitialAppData = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/customer/activeCustomers/initial/${accountID}/${userID}`);
    const initialAppData = response.data;
    return initialAppData;
  } catch (error) {
    console.error('Error fetching initial app data:', error);
    return [];
  }
};

export const fetchCustomerProfileInformation = async (accountID, userID, customerID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/customer/activeCustomers/customerByID/${accountID}/${userID}/${customerID}`);
    const customerContactInformation = response.data;
    return customerContactInformation;
  } catch (error) {
    console.error('Error fetching customer contact information:', error);
    return [];
  }
};

export const getOutstandingBalanceList = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/invoices/createInvoice/AccountsWithBalance/${accountID}/${userID}`);
    const outstandingInvoicesList = response.data;
    return outstandingInvoicesList;
  } catch (error) {
    console.error('Error fetching outstanding invoices data:', error);
    return [];
  }
};

// ToDO will need to update to S3 bucket once dev is complete.
export const getZippedInvoices = async (zipFileName, accountID, userID) => {
  try {
    const queryParams = new URLSearchParams({
      filename: zipFileName
    }).toString();

    const url = `${config.API_ENDPOINT}/invoices/getZippedInvoices/${accountID}/${userID}?${queryParams}`;

    // Redirect the browser to the download URL
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to download URL:', error);
  }
};

export const fetchSingleTransaction = async (customer_id, transaction_id, accountID, userID) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/transactions/getSingleTransaction/${customer_id}/${transaction_id}/${accountID}/${userID}`
    );
    const transaction = response.data;
    return transaction;
  } catch (error) {
    console.error('Error fetching single transaction:', error);
    return [];
  }
};

export const fetchSinglePayment = async (paymentID, accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/payments/getSinglePayment/${paymentID}/${accountID}/${userID}`);
    const payment = response.data;
    return payment;
  } catch (error) {
    console.error('Error fetching single payment:', error);
    return [];
  }
};

export const fetchSingleWriteOff = async (writeOffID, accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/writeOffs/getSingleWriteOff/${writeOffID}/${accountID}/${userID}`);
    const writeOff = response.data;
    return writeOff;
  } catch (error) {
    console.error('Error fetching single write off:', error);
    return [];
  }
};

export const fetchSingleJob = async (customer_job_id, accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobs/getSingleJob/${customer_job_id}/${accountID}/${userID}`);
    const job = response.data;
    return job;
  } catch (error) {
    console.error('Error fetching single job:', error);
    return [];
  }
};

export const fetchSingleJobType = async (jobTypeID, accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobTypes/getSingleJobType/${jobTypeID}/${accountID}/${userID}`);
    const job = response.data;
    return job;
  } catch (error) {
    console.error('Error fetching single job:', error);
    return [];
  }
};

export const fetchAccountRetainers = async (accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/retainers/getActiveRetainers/${accountID}/${userID}`);
    const retainers = response.data;
    return retainers;
  } catch (error) {
    console.error('Error fetching retainers:', error);
    return [];
  }
};

export const fetchSingleRetainer = async (retainerID, accountID, userID) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/retainers/getSingleRetainer/${retainerID}/${accountID}/${userID}`);
    const retainer = response.data;
    return retainer;
  } catch (error) {
    console.error('Error fetching single retainer:', error);
    return [];
  }
};
