import React, { useState } from 'react';
import { Stack, Button, Typography, Alert } from '@mui/material';
import InitialSelectionOptions from '../../Components/TransactionFormOptions/InitialSelectionOptions';
import { postTransaction } from '../../Services/ApiCalls/PostCalls';
import ChargeOptions from '../../Components/TransactionFormOptions/ChargeOptions';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { context } from '../../App';

export default function Charge({ optionLists, setOptionLists }) {
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

  const handleSubmit = async () => {
    const dataToPost = formObjectForPost();
    const postedItem = await postTransaction(dataToPost);
    setPostStatus(postedItem.status);
    resetState();
  };

  const resetState = () => {
    setOptionLists({ ...optionLists, customerJobsList: [] });
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
    customerID: selectedItems.selectedCustomer.customerID,
    customerJobID: selectedItems.selectedJob.customerJobID,
    userID: loggedInUser.customerID,
    detailedJobDescription: selectedItems.selectedJob.jobDescription,
    customerInvoicesID: null,
    dateCreated: dayjs().format(),
    transactionDate: dayjs(selectedItems.selectedDate).format(),
    transactionType: 'Charge',
    quantity: selectedItems.quantity,
    unitCost: selectedItems.unitCost,
    totalTransaction: selectedItems.quantity * selectedItems.unitCost,
    isTransactionBillable: selectedItems.isTransactionBillable
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
          <ChargeOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Typography>Total:{selectedItems.quantity * selectedItems.unitCost}</Typography>

        <Button onClick={handleSubmit}>Primary</Button>
        {postStatus && <Alert severity={postStatus === 200 ? 'success' : 'error'}>{postStatus}</Alert>}
      </Stack>
    </>
  );
}
