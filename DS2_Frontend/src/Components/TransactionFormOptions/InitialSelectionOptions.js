import { Stack, TextField, Autocomplete } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function InitialSelectionOptions({ optionLists, selectedItems, setSelectedItems }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <Autocomplete
            size='small'
            value={selectedItems.selectedCustomer}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedCustomer: newValue }))}
            getOptionLabel={option => option.customerName || ''}
            options={optionLists.customersList}
            sx={{ width: 350 }}
            renderInput={params => <TextField {...params} label='Select Customer' variant='standard' />}
          />

          <Autocomplete
            required
            size='small'
            value={selectedItems.selectedJob}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedJob: newValue }))}
            getOptionLabel={option => option.jobDescription || ''}
            options={optionLists.customerJobsList}
            sx={{ width: 350 }}
            renderInput={params => <TextField {...params} label='Select Job' variant='standard' />}
          />

          <Autocomplete
            required
            size='small'
            value={selectedItems.selectedTeamMember}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedTeamMember: newValue }))}
            getOptionLabel={option => option.displayName || ''}
            options={optionLists.teamMembersList}
            sx={{ width: 350 }}
            renderInput={params => <TextField {...params} label='Select Team Member' variant='standard' />}
          />

          <DateTimePicker
            required
            label='Select Transaction Date'
            value={selectedItems.selectedDate}
            onChange={newValue => setSelectedItems(otherItems => ({ ...otherItems, selectedDate: dayjs(newValue) }))}
            renderInput={params => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
    </>
  );
}
