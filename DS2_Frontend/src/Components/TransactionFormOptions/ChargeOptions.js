import { Stack, TextField, Checkbox, FormControlLabel } from '@mui/material';

export default function ChargeOptions({ selectedItems, setSelectedItems }) {
  return (
    <>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <TextField
            variant='standard'
            sx={{ width: 100 }}
            type='number'
            label='Quantity'
            value={selectedItems.quantity}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, quantity: e.target.value }))}
          />
          <TextField
            variant='standard'
            sx={{ width: 100 }}
            type='number'
            label='Unit Cost'
            value={selectedItems.unitCost}
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
