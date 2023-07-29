import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';

export default function CustomerProfileJobs({ profileData }) {
  const customerInvoices = profileData?.customerJobData?.grid ?? {};
  return (
    <>
      <Stack spacing={3}>
        <DataGridTable tableData={customerInvoices} checkboxSelection={false} />
      </Stack>
    </>
  );
}
