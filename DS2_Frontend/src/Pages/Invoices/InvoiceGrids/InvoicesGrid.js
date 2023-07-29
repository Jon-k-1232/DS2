import React from 'react';
import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';

export default function InvoicesGrid({ customerData }) {
  const { invoicesList: { activeInvoiceData = {} } = {} } = customerData || {};

  if (!customerData || !customerData.invoicesList || !customerData.invoicesList.activeInvoiceData) {
    // Render a loading indicator or an empty state here
    return <div>Loading...</div>;
  }

  return (
    <>
      <Stack spacing={3}>
        <DataGridTable title='Invoices' tableData={activeInvoiceData.grid} />
      </Stack>
    </>
  );
}
