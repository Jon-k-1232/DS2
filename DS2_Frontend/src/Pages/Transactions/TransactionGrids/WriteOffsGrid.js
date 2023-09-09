import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';
import WriteOff from '../TransactionForms/AddTransaction/WriteOff';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import palette from '../../../Theme/palette';

export default function WriteOffsGrid({ customerData, setCustomerData }) {
   if (!customerData || !customerData.writeOffsList || !customerData.writeOffsList.activeWriteOffsData) {
      // You can render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   const {
      writeOffsList: { activeWriteOffsData }
   } = customerData;

   const gridButtons = [
      {
         dialogTitle: 'New Write Off',
         tooltipText: 'New Write Off',
         icon: () => <PlaylistRemoveIcon style={{ color: palette.primary.main }} />,
         component: () => <WriteOff customerData={customerData} setCustomerData={data => setCustomerData(data)} />
      }
   ];

   return (
      <>
         <Stack spacing={3}>
            <DataGridTable
               title='Write Offs'
               tableData={activeWriteOffsData.grid}
               checkboxSelection={false}
               enableSingleRowClick
               rowSelectionOnly
               arrayOfButtons={gridButtons}
               routeToPass={'/transactions/customerWriteOffs/deleteWriteOff'}
            />
         </Stack>
      </>
   );
}
