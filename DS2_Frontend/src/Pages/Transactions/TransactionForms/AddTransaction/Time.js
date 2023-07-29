import React, { useState, useContext } from 'react';
import { Stack, Button, Typography, Alert, Box } from '@mui/material';
import dayjs from 'dayjs';
import InitialSelectionOptions from './FormSubComponents/InitialSelectionOptions';
import TimeOptions from './FormSubComponents/TimeOptions';
import { formObjectForTransactionPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import { postTransaction } from '../../../../Services/ApiCalls/PostCalls';
import { context } from '../../../../App';
import InformationDialog from '../../../../Components/Dialogs/InformationDialog';

const initialState = {
  selectedCustomer: null,
  selectedJob: null,
  selectedTeamMember: null,
  detailedJobDescription: '',
  selectedDate: dayjs(),
  isTransactionBillable: true,
  isInAdditionToMonthlyCharge: false,
  unitCost: 0,
  quantity: 1,
  transactionType: 'Charge'
};

export default function Time({ customerData, setCustomerData }) {
  const { loggedInUser } = useContext(context);
  const { accountID, userID } = useContext(context).loggedInUser;

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState(initialState);
  // Destructure selectedItems
  const { unitCost, quantity } = selectedItems;

  const handleSubmit = async () => {
    const dataToPost = formObjectForTransactionPost(selectedItems, loggedInUser, 'Time');
    const postedItem = await postTransaction(dataToPost, accountID, userID);

    setPostStatus(postedItem);
    if (postedItem.status === 200) resetState(postedItem);
  };

  const resetState = postedItem => {
    setCustomerData({ ...customerData, transactionsList: postedItem.transactionsList });
    setSelectedItems(initialState);
    setTimeout(() => setPostStatus(null), 4000);
  };

  return (
    <>
      <Stack spacing={3}>
        <InformationDialog
          dialogText={dialogText}
          dialogTitle='Time Transaction Help'
          toolTipText={'Info'}
          buttonLocation={{ position: 'absolute', top: '1em', right: '1em', cursor: 'pointer' }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <InitialSelectionOptions
            customerData={customerData}
            setCustomerData={data => setCustomerData(data)}
            selectedItems={selectedItems}
            setSelectedItems={data => setSelectedItems(data)}
            initialState={initialState}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <TimeOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Typography variant='body1'>
          Total:
          {(quantity * unitCost)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Typography>

        <Box style={{ textAlign: 'center' }}>
          <Button onClick={handleSubmit}>Submit</Button>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>
      </Stack>
    </>
  );
}

const dialogText = [
  `To input time, select a customer, job, and team member first. The dollar amount and time are calculated based on the team member's billing rate.`,
  'Work completed on the job will not appear on the bill. This is used to provide additional context of what the job entailed in one sentence length.'
];
