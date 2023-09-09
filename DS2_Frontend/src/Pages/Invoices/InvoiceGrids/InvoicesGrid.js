import React from 'react';
import { Stack } from '@mui/material';
import ExpandableGrid from '../../../Components/DataGrids/ExpandableGrid';

export default function InvoicesGrid({ customerData }) {
   const { invoicesList: { activeInvoiceData = {} } = {} } = customerData || {};

   if (!customerData || !customerData.invoicesList || !customerData.invoicesList.activeInvoiceData) {
      // Render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   return (
      <>
         <Stack spacing={3}>
            <ExpandableGrid title='Invoices' idField='customer_invoice_id' parentColumnName='parent_invoice_id' tableData={activeInvoiceData} checkboxSelection rowSelectionOnly />
         </Stack>
      </>
   );
}
