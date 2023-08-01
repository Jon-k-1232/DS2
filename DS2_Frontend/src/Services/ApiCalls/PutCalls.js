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

export const putUpdateAccount = async (data, token) => {
  const url = `${config.API_ENDPOINT}/account/updateAccount/:accountID`;
  try {
    const response = await axios.post(url, { account: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting update account:', error);
    throw error;
  }
};

export const putUpdateAccountAddress = async (data, token) => {
  const url = `${config.API_ENDPOINT}/account/updateAccountAddress/:accountID`;
  try {
    const response = await axios.post(url, { accountAddress: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting update account address:', error);
    throw error;
  }
};

export const putEditTransaction = async (data, accountID, userID, token) => {
  const url = `${config.API_ENDPOINT}/transactions/updateTransaction/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { transaction: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting transaction edit:', error);
    throw error;
  }
};

export const putEditPayment = async (data, accountID, userID, token) => {
  const url = `${config.API_ENDPOINT}/payments/updatePayment/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { payment: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting payment edit:', error);
    throw error;
  }
};

export const putEditCustomer = async (data, accountID, userID, token) => {
  const url = `${config.API_ENDPOINT}/customer/updateCustomer/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { customer: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting customer edit:', error);
    throw error;
  }
};

export const postEditCustomerJob = async (data, accountID, userID, token) => {
  const url = `${config.API_ENDPOINT}/jobs/updateJob/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { job: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting new customer job:', error);
    throw error;
  }
};

export const postEditJobType = async (data, accountID, userID, token) => {
  const url = `${config.API_ENDPOINT}/jobTypes/updateJobType/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { jobType: data }, headers(token));
    return response.data;
  } catch (error) {
    console.error('Error while posting new job type:', error);
    throw error;
  }
};
