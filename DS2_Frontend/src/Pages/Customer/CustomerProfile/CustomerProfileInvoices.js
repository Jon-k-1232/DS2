import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';

export default function CustomerProfileInvoices({ profileData }) {
  const customerInvoices = profileData?.customerInvoiceData?.grid ?? {};
  return (
    <>
      <Stack spacing={3}>
        <DataGridTable tableData={customerInvoices} checkboxSelection={false} />
      </Stack>
    </>
  );
}
