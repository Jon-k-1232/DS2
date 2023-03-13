import { Stack, TextField, Checkbox, FormControlLabel } from '@mui/material';

export default function ChargeOptions({ selectedItems, setSelectedItems }) {
  const { detailedJobDescription, quantity, unitCost } = selectedItems;
  return (
    <>
      <Stack spacing={3}>
        <Stack>
          <TextField
            sx={{ width: 300 }}
            variant='standard'
            label='Work Completed On Job'
            value={detailedJobDescription}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, detailedJobDescription: e.target.value }))}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <TextField
            variant='standard'
            sx={{ width: 100 }}
            type='number'
            label='Quantity'
            value={quantity}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, quantity: e.target.value }))}
          />
          <TextField
            variant='standard'
            sx={{ width: 100 }}
            type='number'
            label='Unit Cost'
            value={unitCost}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, unitCost: e.target.value }))}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedItems.isTransactionBillable}
                onChange={e => setSelectedItems(otherItems => ({ ...otherItems, isTransactionBillable: e.target.checked }))}
              />
            }
            label='Billable'
          />
        </Stack>
      </Stack>
    </>
  );
}
