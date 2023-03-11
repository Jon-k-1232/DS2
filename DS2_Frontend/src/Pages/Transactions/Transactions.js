import { Stack } from '@mui/material';
import DataGridTable from '../../Components/DataGrids/DataGrid';

export default function Transactions({ transactionsList }) {
  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          tableData={transactionsList}
          checkboxSelection={false}
          setArrayOfSelectedRows={e => console.log(e)}
          setSingleSelectedRow={e => console.log(e)}
        />
      </Stack>
    </>
  );
}
