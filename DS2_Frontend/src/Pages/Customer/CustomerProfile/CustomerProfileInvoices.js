import { Stack } from '@mui/material';
import ExpandableGrid from '../../../Components/DataGrids/ExpandableGrid';

export default function CustomerProfileInvoices({ profileData }) {
   const { customerInvoiceData = {} } = profileData || {};

   if (!profileData || !profileData.customerInvoiceData) {
      // Render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   return (
      <>
         <Stack spacing={3}>
            <ExpandableGrid idField='customer_invoice_id' parentColumnName='parent_invoice_id' tableData={customerInvoiceData} checkboxSelection rowSelectionOnly />
         </Stack>
      </>
   );
}
