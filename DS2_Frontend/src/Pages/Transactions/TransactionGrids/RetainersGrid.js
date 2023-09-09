import { Stack } from '@mui/material';
import ExpandableGrid from '../../../Components/DataGrids/ExpandableGrid';
import Retainer from '../TransactionForms/AddTransaction/Retainer';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import palette from '../../../Theme/palette';

export default function RetainersGrid({ customerData, setCustomerData }) {
   if (!customerData || !customerData.accountRetainersList || !customerData.accountRetainersList.activeRetainerData) {
      // You can render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   const {
      accountRetainersList: { activeRetainerData }
   } = customerData;

   const gridButtons = [
      {
         dialogTitle: 'New Retainer',
         tooltipText: 'New Retainer',
         icon: () => <LibraryAddIcon style={{ color: palette.primary.main }} />,
         component: () => <Retainer customerData={customerData} setCustomerData={data => setCustomerData(data)} />
      }
   ];

   return (
      <>
         <Stack spacing={3}>
            <ExpandableGrid
               title='Retainers and Deposits'
               idField='retainer_id'
               parentColumnName='parent_retainer_id'
               tableData={activeRetainerData}
               arrayOfButtons={gridButtons}
               checkboxSelection
               enableSingleRowClick
               rowSelectionOnly
               routeToPass={'/transactions/customerRetainers/deleteRetainer'}
            />
         </Stack>
      </>
   );
}
