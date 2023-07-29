import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';
import NewCustomer from '../CustomerForms/AddCustomer/NewCustomer';
import AddIcon from '@mui/icons-material/Add';
import palette from '../../../Theme/palette';

export default function Customers({ customerData, setCustomerData }) {
  if (!customerData || !customerData.customersList || !customerData.customersList.activeCustomerData) {
    // You can render a loading indicator or an empty state here
    return <div>Loading...</div>;
  }

  const {
    customersList: { activeCustomerData }
  } = customerData;

  const gridButtons = [
    {
      dialogTitle: 'New Customer',
      tooltipText: 'Add Customer',
      icon: () => <AddIcon style={{ color: palette.primary.main }} />,
      component: () => <NewCustomer customerData={customerData} setCustomerData={data => setCustomerData(data)} />
    }
  ];

  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          title='Customers'
          tableData={activeCustomerData.grid}
          checkboxSelection={false}
          enableSingleRowClick
          arrayOfButtons={gridButtons}
          routeToPass='/customers/customersList/customerProfile/customerInvoices'
        />
      </Stack>
    </>
  );
}
