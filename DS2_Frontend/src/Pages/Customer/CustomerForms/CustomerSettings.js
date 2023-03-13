import { Stack, TextField } from '@mui/material';

export default function CustomerSettings({ selectedItems, setSelectedItems }) {
  const { firstName, lastName, businessName, customerEntityType } = selectedItems;

  return (
    <>
      <Stack spacing={3}>
        <Stack direction='row' alignItems='right' justifyContent='space-between' mb={2}></Stack>
      </Stack>
    </>
  );
}
