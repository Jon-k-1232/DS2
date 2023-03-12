import { Stack, TextField, Autocomplete } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import './Transactions.css';

export default function InitialSelectionOptions({ optionLists, selectedItems, setSelectedItems, page }) {
  const { teamMembersList, customerJobsList, customersList } = optionLists;
  const { selectedDate, selectedCustomer, selectedJob, selectedTeamMember } = selectedItems;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <DateTimePicker
            className='myDatePicker'
            required
            label='Select Transaction Date'
            value={selectedDate || dayjs()}
            onChange={newValue => setSelectedItems(otherItems => ({ ...otherItems, selectedDate: dayjs(newValue) }))}
            renderInput={params => <TextField {...params} />}
          />

          <Autocomplete
            size='small'
            value={selectedCustomer}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedCustomer: newValue }))}
            getOptionLabel={option => option.customerName || ''}
            options={customersList || []}
            sx={{ width: 350 }}
            renderInput={params => <TextField {...params} label='Select Customer' variant='standard' />}
          />

          {page !== 'Payment' && (
            <Autocomplete
              required
              size='small'
              value={selectedJob}
              onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedJob: newValue }))}
              getOptionLabel={option => option.jobDescription || ''}
              options={customerJobsList || []}
              sx={{ width: 350 }}
              renderInput={params => <TextField {...params} label='Select Job' variant='standard' />}
            />
          )}

          <Autocomplete
            required
            size='small'
            value={selectedTeamMember}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedTeamMember: newValue }))}
            getOptionLabel={option => option.displayName || ''}
            options={teamMembersList || []}
            sx={{ width: 350 }}
            renderInput={params => <TextField {...params} label='Select Team Member' variant='standard' />}
          />
        </Stack>
      </LocalizationProvider>
    </>
  );
}
