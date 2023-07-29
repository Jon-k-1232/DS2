import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';
import NewJob from '../JobForms/AddJob/NewJob';
import AddIcon from '@mui/icons-material/Add';
import palette from '../../../Theme/palette';

export default function JobsGrid({ customerData, setCustomerData }) {
  const { accountJobsList: { activeJobData = {} } = {} } = customerData || {};

  if (!customerData || !customerData.accountJobsList || !customerData.accountJobsList.activeJobData) {
    // Render a loading indicator or an empty state here
    return <div>Loading...</div>;
  }

  const gridButtons = [
    {
      dialogTitle: 'New Customer Job',
      tooltipText: 'Add New Customer Job',
      icon: () => <AddIcon style={{ color: palette.primary.main }} />,
      component: () => <NewJob customerData={customerData} setCustomerData={data => setCustomerData(data)} />
    }
  ];

  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          title='Jobs'
          tableData={activeJobData.grid}
          checkboxSelection={false}
          arrayOfButtons={gridButtons}
          enableSingleRowClick
          routeToPass={'/jobs/jobsList/deleteJob'}
        />
      </Stack>
    </>
  );
}
