import axios from 'axios';
import config from '../../config';

export const postTransaction = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/transactions/createTransaction/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { transaction: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new transaction:', error);
    throw error;
  }
};

export const postNewPayment = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/payments/createPayment/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { payment: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new payment:', error);
    throw error;
  }
};

export const postNewWriteOff = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/writeOffs/createWriteOffs/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { writeOff: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new write off:', error);
    throw error;
  }
};

export const postNewJobCategory = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/jobCategories/createJobCategory/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { jobCategory: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new job category:', error);
    throw error;
  }
};

export const postNewCustomer = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/customer/createCustomer/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { customer: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new customer:', error);
    throw error;
  }
};

export const postNewJobType = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/jobTypes/createJobType/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { jobType: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new job type:', error);
    throw error;
  }
};

export const postNewCustomerJob = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/jobs/createJob/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { job: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new customer job:', error);
    throw error;
  }
};

export const postNewTeamMember = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/user/createUser/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { user: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new team member:', error);
    throw error;
  }
};

export const postInvoiceCreation = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/invoices/createInvoice/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { invoice: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new invoice:', error);
    throw error;
  }
};

export const postNewRecurringCustomer = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/recurringCustomer/createRecurringCustomer/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { recurringCustomer: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new recurring customer:', error);
    throw error;
  }
};

export const postNewRetainer = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/retainers/createRetainer/${accountID}/${userID}`;
  try {
    const response = await axios.post(url, { retainer: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting new retainer:', error);
    throw error;
  }
};
