import axios from 'axios';
import config from '../../config';
import TokenService from '../TokenService';

const headers = memoryToken => {
  const token = memoryToken || TokenService.getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getCustomerJobsList = async (accountID, userID, customerID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/jobs/getActiveCustomerJobs/${accountID}/${userID}/${customerID}`,
      headers(token)
    );
    const customerJobsList = response.data;
    return customerJobsList;
  } catch (error) {
    console.error('Error fetching customer jobs data:', error);
    return [];
  }
};

export const getInitialAppData = async (accountID, userID, token) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/initialData/initialBlob/${accountID}/${userID}`, headers(token));
    const initialAppData = response.data;
    return initialAppData;
  } catch (error) {
    console.error('Error fetching initial app data:', error);
    return [];
  }
};

export const fetchCustomerProfileInformation = async (accountID, userID, customerID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/customer/activeCustomers/customerByID/${accountID}/${userID}/${customerID}`,
      headers(token)
    );
    const customerContactInformation = response.data;
    return customerContactInformation;
  } catch (error) {
    console.error('Error fetching customer contact information:', error);
    return [];
  }
};

export const fetchSingleUser = async (accountID, userID, token) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/user/fetchSingleUser/${accountID}/${userID}`, headers(token));
    const singleUser = response.data;
    return singleUser;
  } catch (error) {
    console.error('Error fetching single user:', error);
    return [];
  }
};

export const getOutstandingBalanceList = async (accountID, userID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/invoices/createInvoice/AccountsWithBalance/${accountID}/${userID}`,
      headers(token)
    );
    const outstandingInvoicesList = response.data;
    return outstandingInvoicesList;
  } catch (error) {
    console.error('Error fetching outstanding invoices data:', error);
    return [];
  }
};

// ToDO will need to update to S3 bucket once dev is complete.
export const getZippedInvoices = async (zipFileName, accountID, userID, token) => {
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

export const fetchSingleTransaction = async (customer_id, transaction_id, accountID, userID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/transactions/getSingleTransaction/${customer_id}/${transaction_id}/${accountID}/${userID}`,
      headers(token)
    );
    const transaction = response.data;
    return transaction;
  } catch (error) {
    console.error('Error fetching single transaction:', error);
    return [];
  }
};

export const fetchSinglePayment = async (paymentID, accountID, userID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/payments/getSinglePayment/${paymentID}/${accountID}/${userID}`,
      headers(token)
    );
    const payment = response.data;
    return payment;
  } catch (error) {
    console.error('Error fetching single payment:', error);
    return [];
  }
};

export const fetchSingleWriteOff = async (writeOffID, accountID, userID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/writeOffs/getSingleWriteOff/${writeOffID}/${accountID}/${userID}`,
      headers(token)
    );
    const writeOff = response.data;
    return writeOff;
  } catch (error) {
    console.error('Error fetching single write off:', error);
    return [];
  }
};

export const fetchSingleJob = async (customer_job_id, accountID, userID, token) => {
  try {
    const response = await axios.get(`${config.API_ENDPOINT}/jobs/getSingleJob/${customer_job_id}/${accountID}/${userID}`, headers(token));
    const job = response.data;
    return job;
  } catch (error) {
    console.error('Error fetching single job:', error);
    return [];
  }
};

export const fetchSingleJobType = async (jobTypeID, accountID, userID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/jobTypes/getSingleJobType/${jobTypeID}/${accountID}/${userID}`,
      headers(token)
    );
    const job = response.data;
    return job;
  } catch (error) {
    console.error('Error fetching single job:', error);
    return [];
  }
};

export const fetchSingleRetainer = async (retainerID, accountID, userID, token) => {
  try {
    const response = await axios.get(
      `${config.API_ENDPOINT}/retainers/getSingleRetainer/${retainerID}/${accountID}/${userID}`,
      headers(token)
    );
    const retainer = response.data;
    return retainer;
  } catch (error) {
    console.error('Error fetching single retainer:', error);
    return [];
  }
};
