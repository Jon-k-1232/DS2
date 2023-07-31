import { useState, useEffect, useContext } from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import NewJob from '../../../../Jobs/JobForms/AddJob/NewJob';
import NewCustomer from '../../../../Customer/CustomerForms/AddCustomer/NewCustomer';
import AutoCompleteWithDialog from '../../../../../Components/Dialogs/AutoCompleteWithDialog';
import { getCustomerJobsList } from '../../../../../Services/ApiCalls/GetCalls';
import { context } from '../../../../../App';
import './Transactions.css';
import SplitOptionLabel from '../../../../../Components/SplitOptionLabel';

export default function InitialSelectionOptions({
  customerData,
  selectedItems,
  setSelectedItems,
  customerProfileData,
  initialState,
  page
}) {
  // Destructure state variables from the props
  const combinedData = { ...customerData, ...selectedItems, ...customerProfileData };
  const { selectedDate, selectedCustomer, selectedJob, selectedTeamMember, selectedInvoice } = combinedData;

  const activeCustomers = combinedData.customersList?.activeCustomerData?.activeCustomers || [];
  const activeUsers = combinedData.teamMembersList?.activeUserData?.activeUsers || [];
  const customerInvoiceData = combinedData?.customerInvoiceData?.customerInvoiceData || [];
  const customerTransactionData = combinedData?.customerTransactionData?.customerTransactionData || [];
  const customerJobData = combinedData?.customerJobData?.customerJobData || [];

  const { accountID, userID, token } = useContext(context).loggedInUser;

  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [customerJobs, setCustomerJobs] = useState([]);

  // Fetch jobs based on the selected customer
  useEffect(() => {
    if (selectedCustomer) {
      const fetchJobs = async () => {
        const customerJobsList = await getCustomerJobsList(accountID, userID, selectedCustomer.customer_id, token);
        const activeCustomerJobs = customerJobsList?.activeCustomerJobData?.activeCustomerJobs || [];
        setCustomerJobs(activeCustomerJobs);
      };
      fetchJobs();
    }
    // eslint-disable-next-line
  }, [selectedCustomer]);

  const handleAutocompleteChange = (key, value) => {
    // The reset is needed on payments in case user selects customer, then invoice, then changes mind and selects a different customer
    if (key === 'selectedCustomer' && initialState) setSelectedItems(initialState);
    if (key === 'selectedInvoice') setSelectedItems({ ...selectedItems, selectedJob: null });
    setSelectedItems(prevItems => ({ ...prevItems, [key]: value }));
  };

  const jobAutoCompleteProps = {
    autoCompleteLabel: 'Select Job',
    autoCompleteOptionsList: customerJobs,
    onChangeKey: 'selectedJob',
    optionLabelProperty: 'job_description',
    valueTestProperty: 'customer_job_id',
    addedOptionLabel: 'Add New Job',
    selectedOption: selectedJob,
    handleAutocompleteChange: handleAutocompleteChange
  };

  const customerAutoCompleteProps = {
    autoCompleteLabel: 'Select Customer',
    autoCompleteOptionsList: activeCustomers,
    onChangeKey: 'selectedCustomer',
    optionLabelProperty: 'display_name',
    valueTestProperty: 'customer_id',
    addedOptionLabel: 'Add New Customer',
    selectedOption: selectedCustomer,
    handleAutocompleteChange: handleAutocompleteChange
  };

  const findCustomerInvoices = () => {
    const customerOutstandingInvoiceOptions = customerInvoiceData.filter(invoice => invoice.remaining_balance_on_invoice > 0);
    return customerOutstandingInvoiceOptions;
  };

  const findInvoiceJobs = () => {
    if (!selectedInvoice) return [];
    const { customer_invoice_id } = selectedInvoice;
    // Find all transactions associated with the invoice and return the job IDs, no duplicates to be returned.
    const invoiceJobIDs = customerTransactionData.reduce((prev, curr) => {
      if (curr.customer_invoice_id === customer_invoice_id && !prev.includes(curr.customer_job_id)) {
        prev.push(curr.customer_job_id);
      }
      return prev;
    }, []);

    return customerJobData.filter(job => invoiceJobIDs.includes(job.customer_job_id));
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'grid', gap: 3 }}>
          <DateTimePicker
            sx={{ width: 350 }}
            className='myDatePicker'
            required
            label='Select Transaction Date'
            value={selectedDate || dayjs()}
            onChange={newValue => handleAutocompleteChange('selectedDate', dayjs(newValue))}
            renderInput={params => <TextField {...params} />}
          />

          <AutoCompleteWithDialog
            dialogTitle='New Customer'
            dialogOpen={customerDialogOpen}
            setDialogOpen={setCustomerDialogOpen}
            autoCompleteProps={customerAutoCompleteProps}
          >
            <NewCustomer />
          </AutoCompleteWithDialog>

          {page !== 'Retainer' && page !== 'WriteOff' && page !== 'Payment' && (
            <AutoCompleteWithDialog
              dialogTitle='New Job'
              dialogOpen={jobDialogOpen}
              setDialogOpen={setJobDialogOpen}
              autoCompleteProps={jobAutoCompleteProps}
            >
              <NewJob customerData={customerData} />
            </AutoCompleteWithDialog>
          )}

          {page === 'Payment' && (
            <Box>
              <Autocomplete
                size='small'
                sx={{ width: 350 }}
                value={selectedInvoice}
                onChange={(event, value) => handleAutocompleteChange('selectedInvoice', value)}
                getOptionLabel={option => `${option.invoice_number} Remaining:$${option.remaining_balance_on_invoice}`}
                renderOption={(props, option) => (
                  <li {...props}>
                    <SplitOptionLabel alignLeft={option.invoice_number} alignRight={`Remaining:$${option.remaining_balance_on_invoice}`} />
                  </li>
                )}
                options={findCustomerInvoices() || []}
                renderInput={params => <TextField {...params} label='Select Invoice For Invoice Payment' variant='standard' />}
              />

              <Autocomplete
                size='small'
                sx={{ width: 350, marginTop: '15px' }}
                value={selectedJob}
                onChange={(event, value) => handleAutocompleteChange('selectedJob', value)}
                getOptionLabel={option => option.job_description}
                options={findInvoiceJobs() || []}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Select Job for Invoice Payment'
                    variant='standard'
                    helperText='Optionally select a job on the selected invoice to make a job specific payment'
                  />
                )}
              />
            </Box>
          )}

          <Box>
            <Autocomplete
              size='small'
              sx={{ width: 350 }}
              value={selectedTeamMember}
              onChange={(event, value) => handleAutocompleteChange('selectedTeamMember', value)}
              getOptionLabel={option => option.user_name || option.display_name || ''}
              options={activeUsers || []}
              renderInput={params => <TextField {...params} label='Select Team Member' variant='standard' />}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </>
  );
}
