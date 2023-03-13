import { Stack, TextField } from '@mui/material';

export default function WriteOffOptions({ selectedItems, setSelectedItems }) {
  const { unitCost } = selectedItems;

  return (
    <>
      <Stack spacing={3}>
        <Stack direction='row' alignItems='right' justifyContent='space-between' mb={2}>
          <TextField
            sx={{ width: 300 }}
            variant='standard'
            type='number'
            label='Write Off Amount'
            value={unitCost}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, unitCost: -Math.abs(e.target.value) }))}
          />
        </Stack>
      </Stack>
    </>
  );
}
