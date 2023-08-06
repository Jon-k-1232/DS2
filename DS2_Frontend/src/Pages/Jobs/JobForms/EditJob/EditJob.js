import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Alert, Box } from '@mui/material';
import { formObjectForJobPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import { postEditCustomerJob } from '../../../../Services/ApiCalls/PutCalls';
import { context } from '../../../../App';
import NewJobSelections from '../AddJob/FormSubComponents/NewJobSelections';

const initialState = {
  selectedCustomer: null,
  selectedJobDescription: null,
  isQuote: false,
  quoteAmount: '',
  agreedJobAmount: '',
  notes: ''
};

export default function EditJob({ customerData, setCustomerData, jobData }) {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(context);
  const { accountID, userID } = useContext(context).loggedInUser;

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState(initialState);

  const {
    customersList: { activeCustomerData: { activeCustomers } = [] } = [],
    accountJobsList: { activeJobData: { activeJobs } = [] } = []
  } = { ...customerData };

  const {
    account_id,
    agreed_job_amount,
    created_at,
    created_by_user_id,
    current_job_total,
    customer_id,
    customer_job_id,
    is_job_complete,
    is_quote,
    job_quote_amount,
    job_status,
    job_type_id,
    notes,
    parent_job_id
  } = jobData || {};

  useEffect(() => {
    if (jobData && Object.keys(jobData).length) {
      setSelectedItems({
        ...selectedItems,
        currentJobTotal: current_job_total,
        isJobComplete: is_job_complete,
        jobStatus: job_status,
        accountID: account_id,
        createdAt: created_at,
        parentJobID: parent_job_id,
        customerJobID: customer_job_id,
        selectedCustomer: activeCustomers.find(customer => customer.customer_id === customer_id),
        selectedJobDescription: activeJobs.find(jobType => jobType.job_type_id === job_type_id),
        createdByUserID: created_by_user_id,
        isQuote: is_quote,
        quoteAmount: job_quote_amount,
        agreedJobAmount: agreed_job_amount,
        notes
      });
    }
    // eslint-disable-next-line
  }, [jobData]);

  const handleSubmit = async () => {
    const dataToPost = formObjectForJobPost(selectedItems, loggedInUser);
    const postedItem = await postEditCustomerJob(dataToPost, accountID, userID);

    setPostStatus(postedItem);

    if (postedItem.status === 200) {
      setCustomerData({ ...customerData, writeOffsList: postedItem.writeOffsList });
      setTimeout(() => setPostStatus(null), 2000);
      navigate('/jobs/jobsList');
      setSelectedItems(initialState);
    }
  };

  return (
    <>
      <Stack sx={{ marginTop: '25px' }} spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <NewJobSelections
            customerData={customerData}
            selectedItems={selectedItems}
            setSelectedItems={data => setSelectedItems(data)}
            pageName='editJob'
          />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Button onClick={handleSubmit}>Submit</Button>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>
      </Stack>
    </>
  );
}
