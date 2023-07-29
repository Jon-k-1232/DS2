import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';
import Retainer from '../TransactionForms/AddTransaction/Retainer';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import palette from '../../../Theme/palette';

export default function RetainersGrid({ customerData, setCustomerData }) {
  if (!customerData || !customerData.accountRetainersList || !customerData.accountRetainersList.activeRetainerData) {
    // You can render a loading indicator or an empty state here
    return <div>Loading...</div>;
  }

  const {
    accountRetainersList: { activeRetainerData }
  } = customerData;

  const gridButtons = [
    {
      dialogTitle: 'New Retainer',
      tooltipText: 'New Retainer',
      icon: () => <LibraryAddIcon style={{ color: palette.primary.main }} />,
      component: () => <Retainer customerData={customerData} setCustomerData={data => setCustomerData(data)} />
    }
  ];

  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          title='Retainers and Deposits'
          tableData={activeRetainerData.grid}
          checkboxSelection={false}
          enableSingleRowClick
          arrayOfButtons={gridButtons}
          routeToPass={'/transactions/customerRetainers/deleteRetainer'}
        />
      </Stack>
    </>
  );
}
