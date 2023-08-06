import React, { useState, useContext } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import InitialSelectionOptions from './FormSubComponents/InitialSelectionOptions';
import { postTransaction } from '../../../../Services/ApiCalls/PostCalls';
import ChargeOptions from './FormSubComponents/ChargeOptions';
import { formObjectForTransactionPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import dayjs from 'dayjs';
import { context } from '../../../../App';

const initialState = {
  selectedCustomer: null,
  selectedJob: null,
  selectedTeamMember: null,
  selectedGeneralWorkDescription: null,
  detailedJobDescription: '',
  selectedDate: dayjs(),
  isTransactionBillable: true,
  isInAdditionToMonthlyCharge: false,
  unitCost: 0,
  quantity: 1,
  transactionType: 'Charge'
};

export default function Charge({ customerData, setCustomerData }) {
  const { loggedInUser } = useContext(context);
  const { accountID, userID } = loggedInUser;

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState(initialState);
  const { unitCost, quantity } = selectedItems;

  const handleSubmit = async () => {
    const dataToPost = formObjectForTransactionPost(selectedItems, loggedInUser, 'Charge');
    const postedItem = await postTransaction(dataToPost, accountID, userID);

    setPostStatus(postedItem);
    if (postedItem.status === 200) resetState(postedItem);
  };

  const resetState = postedItem => {
    setCustomerData({ ...customerData, transactionsList: postedItem.transactionsList });
    setSelectedItems(initialState);
    setTimeout(() => setPostStatus(null), 4000);
  };

  const formatTotal = value => {
    return value
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <InitialSelectionOptions
          customerData={customerData}
          setCustomerData={data => setCustomerData(data)}
          selectedItems={selectedItems}
          setSelectedItems={data => setSelectedItems(data)}
          initialState={initialState}
        />

        <ChargeOptions customerData={customerData} selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />

        <Typography variant='body1'>Total: {formatTotal(quantity * unitCost)}</Typography>

        <Box style={{ textAlign: 'center' }}>
          <Button onClick={handleSubmit}>Submit</Button>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>
      </Box>
    </>
  );
}
