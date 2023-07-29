import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';

export default function CustomerRetainers({ profileData }) {
  const customerRetainers = profileData?.customerRetainerData?.grid ?? {};
  return (
    <>
      <Stack spacing={3}>
        <DataGridTable tableData={customerRetainers} checkboxSelection={false} />
      </Stack>
    </>
  );
}
