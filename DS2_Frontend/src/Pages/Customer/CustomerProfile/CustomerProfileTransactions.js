import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';

export default function CustomerProfileTransactions({ profileData }) {
  const customerInvoices = profileData?.customerTransactionData?.grid ?? {};
  return (
    <>
      <Stack spacing={3}>
        <DataGridTable tableData={customerInvoices} checkboxSelection={false} />
      </Stack>
    </>
  );
}
