import React, { useState } from 'react';
import { Stack, Button, Typography, Alert } from '@mui/material';
// import { postTransaction } from '../../Services/ApiCalls/PostCalls';
import { formObjectForPost } from './SharedTransactionFunctions';
import InitialSelectionOptions from '../../Components/TransactionFormOptions/InitialSelectionOptions';
import PaymentOptions from '../../Components/TransactionFormOptions/PaymentOptions';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { context } from '../../App';

export default function Payment({ optionLists, setOptionLists }) {
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
    const dataToPost = formObjectForPost(selectedItems, loggedInUser, 'Payment');
    console.log(dataToPost);
    // const postedItem = await postTransaction(dataToPost);
    // setPostStatus(postedItem.status);
    // if (postStatus === 200) {
    //   resetState();
    //   setOptionLists({ ...optionLists, transactionsList: postedItem.updatedTransactionsList });
    // }
  };

  //   const resetState = () => {
  //     setPostStatus(null);
  //     setOptionLists({ ...optionLists, customerJobsList: [] });
  //     setSelectedItems({
  //       selectedCustomer: {},
  //       selectedJob: {},
  //       selectedTeamMember: {},
  //       selectedDate: '',
  //       detailedJobDescription: '',
  //       isTransactionBillable: true,
  //       unitCost: 0,
  //       quantity: 1
  //     });
  //   };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <InitialSelectionOptions
            optionLists={optionLists}
            selectedItems={selectedItems}
            setSelectedItems={data => setSelectedItems(data)}
            page='Payment'
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <PaymentOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <Typography>
            Total:
            {(quantity * unitCost)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        </Stack>

        <Stack>
          <Button onClick={handleSubmit}>Primary</Button>
          {postStatus && <Alert severity={postStatus === 200 ? 'success' : 'error'}>{postStatus}</Alert>}
        </Stack>
      </Stack>
    </>
  );
}
