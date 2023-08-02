import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
import InitialSelectionOptions from '../AddTransaction/FormSubComponents/InitialSelectionOptions';
import { postEditWriteOff } from '../../../../Services/ApiCalls/PutCalls';
import WriteOffOptions from '../AddTransaction/FormSubComponents/WriteOffOptions';
import { formObjectForWriteOffPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import dayjs from 'dayjs';
import { context } from '../../../../App';
import { formatTotal } from '../../../../Services/SharedFunctions';

const initialState = {
  selectedCustomer: null,
  selectedJob: null,
  selectedTeamMember: null,
  writeoffReason: '',
  selectedDate: dayjs(),
  unitCost: 0,
  quantity: 1
};

export default function EditWriteOff({ customerData, setCustomerData, writeOffData }) {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(context);
  const { accountID, userID } = loggedInUser;

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState(initialState);
  const { unitCost, quantity } = selectedItems;
  const {
    customersList: { activeCustomerData: { activeCustomers } = [] } = [],
    accountJobsList: { activeJobData: { activeJobs } = [] } = [],
    teamMembersList: { activeUserData: { activeUsers } = [] } = []
  } = { ...customerData };

  const {
    account_id,
    created_at,
    created_by_user_id,
    customer_id,
    customer_invoice_id,
    customer_job_id,
    note,
    transaction_type,
    writeoff_amount,
    writeoff_date,
    writeoff_id,
    writeoff_reason
  } = writeOffData || {};

  useEffect(() => {
    if (writeOffData) {
      setSelectedItems({
        ...selectedItems,
        accountID: account_id,
        selectedTeamMember: activeUsers.find(user => user.user_id === created_by_user_id),
        createdAt: created_at,
        writeoffReason: String(writeoff_reason),
        writeoffID: writeoff_id,
        selectedDate: dayjs(writeoff_date),
        unitCost: writeoff_amount,
        transactionType: transaction_type,
        selectedCustomer: activeCustomers.find(customer => customer.customer_id === customer_id),
        customerInvoiceID: customer_invoice_id,
        selectedJob: activeJobs.find(job => job.customer_job_id === customer_job_id),
        note
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    const dataToPost = formObjectForWriteOffPost(selectedItems, loggedInUser);
    const postedItem = await postEditWriteOff(dataToPost, accountID, userID);

    setPostStatus(postedItem);
    if (postedItem.status === 200) {
      setCustomerData({ ...customerData, writeOffsList: postedItem.writeOffsList });
      setTimeout(() => setPostStatus(null), 2000);
      navigate('/transactions/customerWriteOffs');
      setSelectedItems(initialState);
    }
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

        <WriteOffOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />

        <Typography>Total: {formatTotal(quantity * unitCost)}</Typography>

        <Box style={{ textAlign: 'center' }}>
          <Button onClick={handleSubmit}>Submit</Button>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>
      </Box>
    </>
  );
}
