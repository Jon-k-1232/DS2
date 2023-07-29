import { Stack, Autocomplete, TextField, FormControlLabel, Checkbox } from '@mui/material';

export default function NewJobSelections({ customerData, selectedItems, setSelectedItems, notes }) {
  const {
    customersList: { activeCustomerData: { activeCustomers } = {} } = {},
    jobTypesList: { activeJobTypesData: { jobTypesData } = {} } = {}
  } = customerData ?? {};
  const { selectedCustomer, selectedJobDescription, isQuote, quoteAmount, agreedJobAmount } = selectedItems;

  return (
    <>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <Autocomplete
            size='small'
            sx={{ width: 350 }}
            value={selectedCustomer}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedCustomer: newValue }))}
            getOptionLabel={option => option.display_name || ''}
            options={activeCustomers || []}
            renderInput={params => <TextField {...params} label='Select Customer' variant='standard' />}
          />
          <TextField
            sx={{ width: '350px' }}
            variant='standard'
            type='number'
            label='Job Quote Amount'
            value={quoteAmount}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, quoteAmount: e.target.value }))}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <Autocomplete
            size='small'
            sx={{ width: 350 }}
            value={selectedJobDescription}
            onChange={(event, newValue) => setSelectedItems(otherItems => ({ ...otherItems, selectedJobDescription: newValue }))}
            getOptionLabel={option => option.job_description || ''}
            options={jobTypesData || []}
            renderInput={params => <TextField {...params} label='Type Of Job' variant='standard' />}
          />

          <TextField
            sx={{ width: '350px' }}
            variant='standard'
            label='Job Notes'
            value={notes}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, notes: e.target.value }))}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <TextField
            sx={{ width: 350 }}
            variant='standard'
            type='number'
            label='Write Off Amount'
            value={agreedJobAmount}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, agreedJobAmount: e.target.value }))}
          />

          <FormControlLabel
            control={
              <Checkbox checked={isQuote} onChange={e => setSelectedItems(otherItems => ({ ...otherItems, isQuote: e.target.checked }))} />
            }
            label='Is this a quote?'
          />
        </Stack>
      </Stack>
    </>
  );
}
