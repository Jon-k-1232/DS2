import React, { useState } from 'react';
import { Stack, Button, Typography, Alert } from '@mui/material';
import InitialSelectionOptions from './TransactionFormOptions/InitialSelectionOptions';
import TimeOptions from './TransactionFormOptions/TimeOptions';
import { postTransaction } from '../../Services/ApiCalls/PostCalls';
import { formObjectForTransactionPost } from '../../Services/SharedPostObjects/SharedPostObjects';
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
    detailedJobDescription: '',
    selectedDate: dayjs(),
    isTransactionBillable: true,
    unitCost: 0,
    quantity: 1
  });
  const { unitCost, quantity } = selectedItems;

  const handleSubmit = async () => {
    const dataToPost = formObjectForTransactionPost(selectedItems, loggedInUser, 'Time');
    console.log(dataToPost);
    const postedItem = await postTransaction(dataToPost);
    setPostStatus(postedItem.status);
    if (postStatus === 200) {
      resetState();
      setOptionLists({ ...optionLists, transactionsList: postedItem.updatedTransactionsList });
    }
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
