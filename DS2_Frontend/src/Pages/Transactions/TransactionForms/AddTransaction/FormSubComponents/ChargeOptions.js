import { Stack, TextField, Checkbox, FormControlLabel, FormControl, Typography, RadioGroup, Radio } from '@mui/material';

export default function ChargeOptions({ selectedItems, setSelectedItems }) {
  const { detailedJobDescription, quantity, unitCost, isTransactionBillable, isInAdditionToMonthlyCharge, selectedCustomer } =
    selectedItems;

  const updateSelectedItems = (key, value) => {
    setSelectedItems(prevItems => ({ ...prevItems, [key]: value }));
  };

  return (
    <Stack spacing={3}>
      <TextField
        sx={{ width: 350, marginTop: '10px' }}
        variant='standard'
        label='Work Completed On Job'
        value={detailedJobDescription}
        onChange={e => updateSelectedItems('detailedJobDescription', e.target.value)}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
        <TextField
          variant='standard'
          sx={{ width: 100 }}
          type='number'
          label='Quantity'
          value={quantity}
          onChange={e => updateSelectedItems('quantity', e.target.value)}
        />
        <TextField
          variant='standard'
          sx={{ width: 100 }}
          type='number'
          label='Unit Cost'
          value={unitCost}
          onChange={e => updateSelectedItems('unitCost', e.target.value)}
        />
      </Stack>

      <FormControlLabel
        control={
          <Checkbox checked={isTransactionBillable} onChange={e => updateSelectedItems('isTransactionBillable', e.target.checked)} />
        }
        label='Billable'
      />

      {selectedCustomer?.is_recurring && (
        <FormControl style={{ width: '350px' }} component='fieldset'>
          <Typography variant='body1'>Is this in addition to the customers monthly base charge?</Typography>
          <RadioGroup
            row
            name='isInAdditionToMonthlyCharge'
            value={isInAdditionToMonthlyCharge ? 'true' : 'false'}
            onChange={e => updateSelectedItems('isInAdditionToMonthlyCharge', e.target.value === 'true')}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
      )}
    </Stack>
  );
}
