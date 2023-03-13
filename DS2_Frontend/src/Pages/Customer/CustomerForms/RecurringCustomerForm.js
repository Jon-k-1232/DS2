import { Stack, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function RecurringCustomerForm({ selectedItems, setSelectedItems }) {
  const { recurringAmount, billingCycle } = selectedItems;

  return (
    <>
      <Stack direction='column' spacing={{ xs: 1, sm: 2 }}>
        <FormControl>
          <RadioGroup
            style={{ display: 'flex', flexDirection: 'row' }}
            value={billingCycle}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, billingCycle: e.target.value }))}
          >
            <FormControlLabel value='1' control={<Radio size='small' />} label='First of the Month' />
            <FormControlLabel value='15' control={<Radio size='small' />} label='Fifteenth of the Month' />
          </RadioGroup>
        </FormControl>

        <TextField
          sx={{ width: 300, marginLeft: '10px' }}
          variant='standard'
          type={'number'}
          label='Recurring Amount'
          value={recurringAmount}
          onChange={e =>
            setSelectedItems(otherItems => ({
              ...otherItems,
              recurringAmount: Number(e.target.value)
            }))
          }
        />
      </Stack>
    </>
  );
}
