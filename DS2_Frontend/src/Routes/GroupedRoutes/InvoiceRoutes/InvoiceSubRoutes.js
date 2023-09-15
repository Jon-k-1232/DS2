import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import PageNavigationHeader from '../../../Components/PageNavigationHeader/PageNavigationHeader';
import { fetchCustomerProfileInformation } from '../../../Services/ApiCalls/FetchCalls';
import { useContext } from 'react';
import { context } from '../../../App';
import { useRowData } from '../../useRowData';
import InvoiceTransactions from '../../../Pages/Invoices/InvoiceDetails/InvoiceTransactions';
import InvoicePayments from '../../../Pages/Invoices/InvoiceDetails/InvoicePayments';
import InvoiceWriteOffs from '../../../Pages/Invoices/InvoiceDetails/InvoiceWriteOffs';
import InvoiceOutstandingInvoices from '../../../Pages/Invoices/InvoiceDetails/InvoiceOutstandingInvoices';
import InvoiceRetainers from '../../../Pages/Invoices/InvoiceDetails/InvoiceRetainers';
import InvoiceDetails from '../../../Pages/Invoices/InvoiceDetails/InvoiceDetails';

export default function InvoiceRoutes({ customerData, setCustomerData }) {
   const navigate = useNavigate();
   const location = useLocation();
   const { accountID, userID, token } = useContext(context).loggedInUser;
   const menuOptions = fetchMenuOptions(navigate);
   const invoiceDetailOptions = fetchDetailOptions(navigate);
   const { rowData } = location?.state ?? {};

   const [invoiceData, setInvoiceData] = useState({});
   const [invoiceID, setInvoiceID] = useState(null);

   // Custom hook to get rowData from context
   // eslint-disable-next-line
   const { rowData: contextRowData } = useRowData();

   useEffect(() => {
      if (rowData || contextRowData || invoiceID) {
         const apiCall = async () => {
            const customerInvoiceID = rowData?.customer_invoice_id || contextRowData?.customer_invoice_id || invoiceID;

            const fetchInvoiceInformation = await fetchCustomerProfileInformation(accountID, userID, customerInvoiceID, token);
            setInvoiceData({ ...fetchInvoiceInformation });
            setInvoiceID(invoiceID);
         };
         apiCall();
      } else {
         navigate('/invoices/invoices');
      }
      // eslint-disable-next-line
   }, []);

   return (
      <>
         <PageNavigationHeader menuOptions={fetchMenuOptions(navigate)} onClickNavigation={() => {}} currentLocation={location} />
         {/* <Routes>
            <Route path='invoiceDetail/*' element={<InvoiceDetails invoiceData={invoiceData} />} />
         </Routes>

         <PageNavigationHeader menuOptions={fetchDetailOptions(navigate)} onClickNavigation={() => {}} currentLocation={location} />

         <div style={{ padding: '20px' }}>
            <Routes>
               <Route path='invoiceTransactions' element={<InvoiceTransactions invoiceData={invoiceData} />} />
               <Route path='invoicePayments' element={<InvoicePayments invoiceData={invoiceData} />} />
               <Route path='invoiceWriteOffs' element={<InvoiceWriteOffs invoiceData={invoiceData} />} />
               <Route path='invoiceOutstandingInvoices' element={<InvoiceOutstandingInvoices invoiceData={invoiceData} />} />
               <Route path='invoiceRetainers' element={<InvoiceRetainers invoiceData={invoiceData} />} />
            </Routes>
         </div> */}
      </>
   );
}

const fetchMenuOptions = navigate => [
   {
      display: 'Invoice Details',
      value: 'invoiceDetail',
      route: '/invoices/invoices/invoiceDetail',
      onClick: () => navigate('/invoices/invoices/invoiceDetail')
   },
   {
      display: 'Delete Invoice',
      value: 'DeleteInvoice',
      route: '/invoices/invoices/invoiceDetail/DeleteInvoice',
      onClick: () => navigate('/invoices/invoices/invoiceDetail/DeleteInvoice')
   }
];

const fetchDetailOptions = navigate => [
   {
      display: 'Transactions',
      value: 'invoiceTransactions',
      route: '/invoices/invoices/invoiceDetail/invoiceTransactions',
      onClick: () => navigate('/invoices/invoices/invoiceDetail/invoiceTransactions')
   },
   {
      display: 'Payments',
      value: 'invoicePayments',
      route: '/invoices/invoices/invoiceDetail/invoicePayments',
      onClick: () => navigate('/invoices/invoices/invoiceDetail/invoicePayments')
   },
   {
      display: 'WriteOffs',
      value: 'invoiceWriteOffs',
      route: '/invoices/invoices/invoiceDetail/invoiceWriteOffs',
      onClick: () => navigate('/invoices/invoices/invoiceDetail/invoiceWriteOffs')
   },
   {
      display: 'OutstandingInvoices',
      value: 'invoiceOutstandingInvoices',
      route: '/invoices/invoices/invoiceDetail/invoiceOutstandingInvoices',
      onClick: () => navigate('/invoices/invoices/invoiceDetail/invoiceOutstandingInvoices')
   },
   {
      display: 'Retainers',
      value: 'invoiceRetainers',
      route: '/invoices/invoices/invoiceDetail/invoiceRetainers',
      onClick: () => navigate('/invoices/invoices/invoiceDetail/invoiceRetainers')
   }
];
