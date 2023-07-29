import axios from 'axios';
import config from '../../config';

export const deleteChargeOrTimeTransaction = async (transaction, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/transactions/deleteTransaction/${accountID}/${userID}`;
  try {
    const response = await axios({
      url: url,
      method: 'DELETE',
      data: { transaction: transaction },
      headers: {
        'content-type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error while deleting transaction:', error);
    throw error;
  }
};

export const deletePayment = async (payment, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/payments/deletePayment/${accountID}/${userID}`;
  try {
    const response = await axios({
      url: url,
      method: 'DELETE',
      data: { payment: payment },
      headers: {
        'content-type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error while deleting payment:', error);
    throw error;
  }
};

export const deleteWriteOff = async (writeOff, accountID, userID) => {
  const url = `${config.API_ENDPOINT}/writeOffs/deleteWriteOffs/${accountID}/${userID}`;
  try {
    const response = await axios({
      url: url,
      method: 'DELETE',
      data: { writeOff: writeOff },
      headers: {
        'content-type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error while deleting write off:', error);
    throw error;
  }
};

export const deleteJob = async (jobID, accountID, userID) => {
  try {
    const response = await axios.delete(`${config.API_ENDPOINT}/jobs/deleteJob/${jobID}/${accountID}/${userID}`, {
      headers: {
        'content-type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteJobType = async (jobTypeID, accountID, userID) => {
  try {
    const response = await axios.delete(`${config.API_ENDPOINT}/jobTypes/deleteJobType/${jobTypeID}/${accountID}/${userID}`, {
      headers: {
        'content-type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRetainer = async (retainerID, accountID, userID) => {
  try {
    const response = await axios.delete(`${config.API_ENDPOINT}/retainers/deleteRetainer/${retainerID}/${accountID}/${userID}`, {
      headers: {
        'content-type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
