import { Stack } from '@mui/material';
import NewJob from '../JobForms/AddJob/NewJob';
import AddIcon from '@mui/icons-material/Add';
import palette from '../../../Theme/palette';
import ExpandableGrid from '../../../Components/DataGrids/ExpandableGrid';

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
            <ExpandableGrid
               title='Jobs'
               idField='customer_job_id'
               parentColumnName='parent_job_id'
               tableData={activeJobData}
               arrayOfButtons={gridButtons}
               checkboxSelection
               enableSingleRowClick
               rowSelectionOnly
               routeToPass={'/jobs/jobsList/deleteJob'}
            />
         </Stack>
      </>
   );
}
