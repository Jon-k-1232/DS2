import React from 'react';
import { Stack, Typography } from '@mui/material';
import UpdateAccount from '../AccountForms/UpdateAccount/UpdateAccount';
import UpdateAccountAddress from '../AccountForms/UpdateAccount/UpdateAccountAddress';

export default function AccountSettings() {
  return (
    <>
      <Stack spacing={3}>
        <Typography variant='h5'>Account Settings</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <UpdateAccount />
          <UpdateAccountAddress />
        </Stack>
      </Stack>
    </>
  );
}
