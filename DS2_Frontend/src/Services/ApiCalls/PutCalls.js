import axios from 'axios';
import config from '../../config';

export const putUpdateAccount = async data => {
  const url = `${config.API_ENDPOINT}/account/updateAccount/:accountID`;
  try {
    const response = await axios.post(url, { account: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting update account:', error);
    throw error;
  }
};

export const putUpdateAccountAddress = async data => {
  const url = `${config.API_ENDPOINT}/account/updateAccountAddress/:accountID`;
  try {
    const response = await axios.post(url, { accountAddress: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting update account address:', error);
    throw error;
  }
};

export const putEditTransaction = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/transactions/updateTransaction/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { transaction: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting transaction edit:', error);
    throw error;
  }
};

export const putEditPayment = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/payments/updatePayment/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { payment: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting payment edit:', error);
    throw error;
  }
};

// /updateCustomer/:customerID/:accountID/:userID

export const putEditCustomer = async (data, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/customer/updateCustomer/${accountID}/${userID}`;
  try {
    const response = await axios.put(url, { customer: data });
    return response.data;
  } catch (error) {
    console.error('Error while posting customer edit:', error);
    throw error;
  }
};
