import React, { useState, useEffect } from 'react';
import {
  Divider,
  Stack,
  Typography,
  TextField,
  Box,
  Button,
  Alert,
  FormControl,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import CreateInvoiceGrid from '../InvoiceGrids/CreateInvoiceGrid';
import { getOutstandingBalanceList, getZippedInvoices } from '../../../Services/ApiCalls/GetCalls';
import CreateInvoiceCheckBoxes from './SubComponents/CreateInvoiceCheckBoxes';
import { postInvoiceCreation } from '../../../Services/ApiCalls/PostCalls';
import { formObjectForInvoiceCreation } from '../../../Services/SharedPostObjects/SharedPostObjects';
import { useContext } from 'react';
import { context } from '../../../App';

const initialState = {
  selectedCustomers: [],
  showWriteOffs: false,
  isRoughDraft: true,
  isFinalized: false,
  isCsvOnly: false,
  manualInvoiceNote: ''
};

export default function CreateNewInvoices({ customerData, setCustomerData }) {
  const {
    loggedInUser,
    loggedInUser: { accountID, userID, token }
  } = useContext(context);

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState(initialState);
  const [outstandingBalanceData, setOutstandingBalanceData] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  const { manualInvoiceNote, isRoughDraft, isFinalized } = selectedItems;

  useEffect(() => {
    const getOutstandingInvoices = async () => {
      const outstandingBalanceList = await getOutstandingBalanceList(accountID, userID, token);
      setOutstandingBalanceData(outstandingBalanceList);
    };
    getOutstandingInvoices();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = () => {
    if (selectedItems.selectedCustomers.length === 0) {
      setSubmitError('You need to select customers to create invoices for.');
      return;
    }
    if (!(selectedItems.showWriteOffs || selectedItems.isRoughDraft || selectedItems.isFinalized || selectedItems.isCsvOnly)) {
      setSubmitError('You need to select at least one checkbox.');
      return;
    }
    if (selectedItems.isFinalized) {
      setOpenDialog(true);
      return;
    }
    submitInvoice();
  };

  const submitInvoice = async () => {
    setSubmitError(null);
    setOpenDialog(false);

    const dataToPost = formObjectForInvoiceCreation(selectedItems, loggedInUser);
    const postedItem = await postInvoiceCreation(dataToPost, accountID, userID);
    setPostStatus(postedItem);
    setTimeout(() => setPostStatus(null), 4000);

    if (postedItem.status === 200) {
      resetState();
      setCustomerData({ ...customerData, invoicesList: postedItem.invoicesList });

      // fetch the zip file
      if (isRoughDraft || isFinalized) {
        const zippedFilePath = postedItem.zipPath;
        getZippedInvoices(zippedFilePath, accountID, userID);
      }
    }
  };

  // Reset the state and grid
  const resetState = () => {
    setSelectedItems(initialState);
    setGridKey(prevKey => prevKey + 1);
  };

  const handleSelectedRowsChange = selectedRows => {
    setSelectedItems({ ...selectedItems, selectedCustomers: selectedRows });
  };

  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <Stack spacing={3}>
        <Typography variant='h6'>Create New Invoices</Typography>

        <Divider />

        <Box display='flex' alignItems='end' gap={4}>
          <TextField
            size='small'
            variant='standard'
            sx={{ width: 350 }}
            label='Add Note To Appear On Selected Invoices'
            value={manualInvoiceNote}
            onChange={e => setSelectedItems({ ...selectedItems, manualInvoiceNote: e.target.value })}
          />

          <CreateInvoiceCheckBoxes selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        </Box>

        <Box>
          <Box display='flex' alignItems='center' gap={4}>
            <Button onClick={handleSubmit}>Submit</Button>
            <FormControl error={submitError !== null}>
              {submitError && <FormHelperText style={{ color: 'red' }}>{submitError}</FormHelperText>}
            </FormControl>
          </Box>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>

        <Divider />

        <CreateInvoiceGrid outstandingBalanceData={outstandingBalanceData} setSelectedRows={handleSelectedRowsChange} key={gridKey} />
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Finalization</DialogTitle>
        <DialogContent>
          <DialogContentText>You are finalizing these invoices, please confirm.</DialogContentText>
          {selectedItems.selectedCustomers.map((customer, index) => (
            <Typography variant='subtitle1' key={index} sx={{ paddingTop: '5px' }}>
              {customer.display_name}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={submitInvoice}>Confirm</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
