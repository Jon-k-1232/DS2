import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';
import Payment from '../TransactionForms/AddTransaction/Payment';
import PaymentIcon from '@mui/icons-material/Payment';
import palette from '../../../Theme/palette';

export default function PaymentsGrid({ customerData, setCustomerData }) {
   if (!customerData || !customerData.paymentsList || !customerData.paymentsList.activePaymentsData) {
      // You can render a loading indicator or an empty state here
      return <div>Loading...</div>;
   }

   const {
      paymentsList: { activePaymentsData }
   } = customerData;

   const gridButtons = [
      {
         dialogTitle: 'New Payment',
         tooltipText: 'New Payment',
         icon: () => <PaymentIcon style={{ color: palette.primary.main }} />,
         component: () => <Payment customerData={customerData} setCustomerData={data => setCustomerData(data)} dialogSize='xl' />
      }
   ];

   return (
      <>
         <Stack spacing={3}>
            <DataGridTable
               title='Payments'
               tableData={activePaymentsData.grid}
               checkboxSelection={false}
               enableSingleRowClick
               rowSelectionOnly
               arrayOfButtons={gridButtons}
               routeToPass={'/transactions/customerPayments/deletePayment'}
            />
         </Stack>
      </>
   );
}
