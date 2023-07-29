import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '../Layouts/Drawer';
import LogoOnlyLayout from '../Layouts/LogoOnlyLayout';
import NotFound from '../Pages/Page404/Page404';
import DashboardRoutes from './GroupedRoutes/DashboardRoutes';
import CustomerRoutes from './GroupedRoutes/CustomerRoutes/CustomerRoutes';
import TransactionsRoutes from './GroupedRoutes/TransactionRoutes/TransactionsRoutes';
import InvoiceRoutes from './GroupedRoutes/InvoiceRoutes';
import AccountRoutes from './GroupedRoutes/AccountRoutes';
import JobRoutes from './GroupedRoutes/JobRoutes/JobRoutes';
import { context } from '../App';
import { getInitialAppData } from '../Services/ApiCalls/GetCalls';

export default function Router() {
  const { accountID, userID } = useContext(context).loggedInUser;

  const [pageTitle, setPageTitle] = useState('');
  const [customerData, setCustomerData] = useState({});

  console.log(customerData);

  // Gets all customer data on page load
  useEffect(() => {
    const apiCall = async () => {
      const initialData = await getInitialAppData(accountID, userID);
      setCustomerData({ ...customerData, ...initialData });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  const handleSetCustomerData = updatedData => setCustomerData(updatedData);

  return (
    <Routes>
      <Route element={<LogoOnlyLayout />}>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' />} />
      </Route>

      <Route element={<DashboardLayout pageTitle={pageTitle} />}>
        <Route path='dashboard/*' element={<DashboardRoutes setPageTitle={pageTitle => setPageTitle(pageTitle)} />} />

        <Route
          path='customers/*'
          element={<CustomerRoutes setPageTitle={setPageTitle} customerData={customerData} setCustomerData={handleSetCustomerData} />}
        />

        <Route
          path='transactions/*'
          element={<TransactionsRoutes setPageTitle={setPageTitle} customerData={customerData} setCustomerData={handleSetCustomerData} />}
        />

        <Route
          path='invoices/*'
          element={<InvoiceRoutes setPageTitle={setPageTitle} customerData={customerData} setCustomerData={handleSetCustomerData} />}
        />

        <Route
          path='jobs/*'
          element={<JobRoutes setPageTitle={setPageTitle} customerData={customerData} setCustomerData={handleSetCustomerData} />}
        />

        <Route
          path='account/*'
          element={<AccountRoutes setPageTitle={setPageTitle} customerData={customerData} setCustomerData={handleSetCustomerData} />}
        />
      </Route>
    </Routes>
  );
}
