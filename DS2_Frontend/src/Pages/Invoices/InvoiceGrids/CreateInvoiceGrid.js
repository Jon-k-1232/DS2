import React from 'react';
import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';

export default function CreateInvoiceGrid({ outstandingBalanceData, setSelectedRows }) {
  if (
    !outstandingBalanceData ||
    !outstandingBalanceData.outstandingBalanceList ||
    !outstandingBalanceData.outstandingBalanceList.activeOutstandingBalancesData
  ) {
    return <div>Loading...</div>;
  }

  const { outstandingBalanceList: { activeOutstandingBalancesData = {} } = {} } = outstandingBalanceData || {};

  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          title='Customers With Balances'
          tableData={activeOutstandingBalancesData.grid}
          checkboxSelection={true}
          setSingleSelectedRow={true}
          setArrayOfSelectedRows={e => setSelectedRows(e)}
        />
      </Stack>
    </>
  );
}
