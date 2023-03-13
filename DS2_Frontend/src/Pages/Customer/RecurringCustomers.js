import { Stack } from '@mui/material';
import DataGridTable from '../../Components/DataGrids/DataGrid';

export default function RecurringCustomers({ optionLists }) {
  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          tableData={optionLists.recurringCustomersList}
          checkboxSelection={false}
          setArrayOfSelectedRows={e => console.log(e)}
          setSingleSelectedRow={e => console.log(e)}
        />
      </Stack>
    </>
  );
}
