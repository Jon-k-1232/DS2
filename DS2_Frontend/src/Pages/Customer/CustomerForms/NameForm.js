import { Stack, TextField } from '@mui/material';

export default function CustomerNameForm({ selectedItems, setSelectedItems }) {
  const { customerFirstName, customerLastName, customerBusinessName, customerEntityType } = selectedItems;

  return (
    <>
      <Stack direction='column' spacing={{ xs: 1, sm: 2 }}>
        {customerEntityType === 'business' && (
          <Stack>
            <TextField
              sx={{ width: 300 }}
              variant='standard'
              label='Business Name'
              value={customerBusinessName}
              onChange={e => setSelectedItems(otherItems => ({ ...otherItems, customerBusinessName: e.target.value }))}
            />
          </Stack>
        )}

        <Stack direction='row' spacing={{ xs: 1, sm: 2 }}>
          <TextField
            sx={{ width: 300, marginRight: '10px' }}
            variant='standard'
            label='First Name'
            value={customerFirstName}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, customerFirstName: e.target.value }))}
          />

          <TextField
            sx={{ width: 300, marginLeft: '10px' }}
            variant='standard'
            label='Last Name'
            value={customerLastName}
            onChange={e => setSelectedItems(otherItems => ({ ...otherItems, customerLastName: e.target.value }))}
          />
        </Stack>
      </Stack>
    </>
  );
}
