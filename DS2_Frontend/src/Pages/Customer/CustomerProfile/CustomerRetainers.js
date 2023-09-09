import { Stack } from '@mui/material';
import ExpandableGrid from '../../../Components/DataGrids/ExpandableGrid';

export default function CustomerRetainers({ profileData }) {
   const { customerRetainerData = {} } = profileData || {};

   if (!profileData || !profileData.customerRetainerData) {
      // Render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   return (
      <>
         <Stack spacing={3}>
            <ExpandableGrid
               idField='retainer_id'
               parentColumnName='parent_retainer_id'
               tableData={customerRetainerData}
               checkboxSelection
               enableSingleRowClick
               rowSelectionOnly
               routeToPass={'/transactions/customerRetainers/deleteRetainer'}
            />
         </Stack>
      </>
   );
}
