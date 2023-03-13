import axios from 'axios';

export const postTransaction = async data => {
  const response = await axios.post('/api/transactions', data);
  return response.data;
};

export const postNewCustomer = async data => {
  const response = await axios.post('/api/customers', data);
  return response.data;
};
