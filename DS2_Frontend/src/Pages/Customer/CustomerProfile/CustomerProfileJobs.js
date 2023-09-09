import { Stack } from '@mui/material';
import ExpandableGrid from '../../../Components/DataGrids/ExpandableGrid';

export default function CustomerProfileJobs({ profileData }) {
   const { customerJobData = {} } = profileData || {};

   if (!profileData || !profileData.customerJobData) {
      // Render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   return (
      <>
         <Stack spacing={3}>
            <ExpandableGrid
               idField='customer_job_id'
               parentColumnName='parent_job_id'
               tableData={customerJobData}
               checkboxSelection
               enableSingleRowClick
               rowSelectionOnly
               routeToPass={'/jobs/jobsList/deleteJob'}
            />
         </Stack>
      </>
   );
}
