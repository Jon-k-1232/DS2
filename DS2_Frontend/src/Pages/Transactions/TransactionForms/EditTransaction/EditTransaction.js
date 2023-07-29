import React, { useState, useContext, useEffect } from 'react';
import { TextField, Typography, Autocomplete, Box, Alert, Button } from '@mui/material';
import InitialSelectionOptions from '../AddTransaction/FormSubComponents/InitialSelectionOptions';
import ChargeOptions from '../AddTransaction/FormSubComponents/ChargeOptions';
import TimeOptions from '../AddTransaction/FormSubComponents/TimeOptions';
import { putEditTransaction } from '../../../../Services/ApiCalls/PutCalls';
import { formObjectForTransactionPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import { context } from '../../../../App';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const initialState = {
  transactionID: null,
  selectedDate: dayjs(),
  selectedCustomer: null,
  selectedJob: null,
  selectedTeamMember: null,
  detailedJobDescription: '',
  isTransactionBillable: null,
  isInAdditionToMonthlyCharge: null,
  unitCost: '',
  quantity: 1,
  transactionType: 'Charge'
};

export default function EditTransaction({ customerData, setCustomerData, transactionData }) {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(context);
  const { accountID, userID } = loggedInUser;

  const [selectedItems, setSelectedItems] = useState(initialState);
  const [postStatus, setPostStatus] = useState(null);

  const { quantity, unitCost, transactionType } = selectedItems;

  const {
    customersList: { activeCustomerData: { activeCustomers } = [] } = [],
    teamMembersList: { activeUserData: { activeUsers } = [] } = [],
    accountJobsList: { activeJobData: { activeJobs } = [] } = []
  } = { ...customerData };

  const {
    transaction_id,
    customer_id,
    customer_job_id,
    detailed_work_description,
    is_excess_to_subscription,
    is_transaction_billable,
    logged_for_user_id,
    unit_cost,
    transaction_date,
    transaction_type
  } = transactionData || {};

  useEffect(() => {
    if (transactionData && Object.keys(transactionData).length) {
      setSelectedItems({
        ...selectedItems,
        transactionID: transaction_id,
        selectedCustomer: activeCustomers.find(customer => customer.customer_id === customer_id),
        selectedJob: activeJobs.find(job => job.customer_job_id === customer_job_id),
        selectedTeamMember: activeUsers.find(user => user.user_id === logged_for_user_id),
        isTransactionBillable: is_transaction_billable,
        detailedJobDescription: detailed_work_description,
        isInAdditionToMonthlyCharge: is_excess_to_subscription,
        unitCost: unit_cost,
        selectedDate: dayjs(transaction_date),
        transactionType: transaction_type || 'Charge'
      });
    }
    // eslint-disable-next-line
  }, [transactionData]);

  const formatTotal = value => {
    return value
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSubmit = async () => {
    const dataToPost = formObjectForTransactionPost(selectedItems, loggedInUser);
    const postedItem = await putEditTransaction(dataToPost, accountID, userID);

    setPostStatus(postedItem);
    if (postedItem.status === 200) {
      setCustomerData({ ...customerData, transactionsList: postedItem.transactionsList });
      resetState();
    }
  };

  const resetState = () => {
    setSelectedItems(initialState);
    setTimeout(() => {
      setPostStatus(null);
      navigate('/transactions/customerTransactions');
    }, 2000);
  };

  return (
    <>
      <Box style={{ width: 'fit-content' }}>
        <InitialSelectionOptions
          customerData={customerData}
          selectedItems={selectedItems}
          setSelectedItems={data => setSelectedItems(data)}
        />

        <Autocomplete
          size='small'
          sx={{ width: 350, marginTop: '10px' }}
          options={['Time', 'Charge']}
          getOptionLabel={option => option || ''}
          value={transactionType || 'Charge'}
          isOptionEqualToValue={(option, value) => option === value || true}
          onChange={(e, value) => setSelectedItems({ ...selectedItems, transactionType: value })}
          renderInput={params => <TextField {...params} label='Transaction Type' variant='standard' />}
        />

        {transactionType.toUpperCase() === 'CHARGE' && (
          <ChargeOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        )}

        {transactionType.toUpperCase() === 'TIME' && (
          <TimeOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        )}

        <Typography style={{ marginTop: '10px', fontSize: '18px' }} variant='body1'>
          Total: {formatTotal(quantity * unitCost)}
        </Typography>

        <Box style={{ margin: '10px', textAlign: 'center' }}>
          <Button onClick={handleSubmit}>Submit</Button>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>
      </Box>
    </>
  );
}
