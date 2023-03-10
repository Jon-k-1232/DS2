import React, { useState } from 'react';
import { Stack, Button, Typography, Alert } from '@mui/material';
import InitialSelectionOptions from '../../Components/TransactionFormOptions/InitialSelectionOptions';
import TimeOptions from '../../Components/TransactionFormOptions/TimeOptions';
import { postTransaction } from '../../Services/ApiCalls/PostCalls';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { context } from '../../App';

export default function Time({ optionLists, setOptionLists }) {
  const { loggedInUser } = useContext(context);

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState({
    selectedCustomer: {},
    selectedJob: {},
    selectedTeamMember: {},
    selectedDate: dayjs(),
    isTransactionBillable: true,
    unitCost: 0,
    quantity: 1
  });
  const { selectedCustomer, selectedJob, selectedTeamMember, selectedDate, isTransactionBillable, unitCost, quantity } = selectedItems;

  const handleSubmit = async () => {
    const dataToPost = formObjectForPost();
    const postedItem = await postTransaction(dataToPost);
    setPostStatus(postedItem.status);
    resetState();
  };

  const resetState = () => {
    setPostStatus(null);
    setOptionLists(otherItems => ({ ...otherItems, customerJobsList: [] }));
    setSelectedItems({
      selectedCustomer: {},
      selectedJob: {},
      selectedTeamMember: {},
      selectedDate: '',
      isTransactionBillable: true,
      unitCost: 0,
      quantity: 1
    });
  };

  const formObjectForPost = () => ({
    accountID: loggedInUser.accountID,
    customerID: selectedCustomer.customerID,
    customerJobID: selectedJob.customerJobID,
    userID: selectedTeamMember.userID,
    detailedJobDescription: selectedJob.jobDescription,
    customerInvoicesID: null,
    dateCreated: dayjs().format(),
    transactionDate: dayjs(selectedDate).format(),
    transactionType: 'Time',
    quantity: quantity,
    unitCost: unitCost,
    totalTransaction: (quantity * unitCost).toFixed(2),
    isTransactionBillable: isTransactionBillable
  });

  return (
    <>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <InitialSelectionOptions
            optionLists={optionLists}
            selectedItems={selectedItems}
            setSelectedItems={data => setSelectedItems(data)}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <TimeOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Typography>
          Total:
          {(quantity * unitCost)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Typography>

        <Button onClick={handleSubmit}>Primary</Button>
        {postStatus && <Alert severity={postStatus === 200 ? 'success' : 'error'}>{postStatus}</Alert>}
      </Stack>
    </>
  );
}
