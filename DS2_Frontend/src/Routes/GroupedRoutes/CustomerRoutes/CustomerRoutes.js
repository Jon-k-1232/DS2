import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import RecurringCustomers from '../../../Pages/RecurringCustomer/RecurringCustomerGrids/RecurringCustomerGrid';
import Customers from '../../../Pages/Customer/CustomerGrids/CustomerGrid';
import CustomerProfileSubRoutes from './CustomerProfileSubRoutes';
import Page from '../../../Components/Page';
import { Stack } from '@mui/material';

export default function CustomerRoutes({ setPageTitle, customerData, setCustomerData }) {
  useEffect(() => {
    setPageTitle('Customers');
  }, [setPageTitle]);

  return (
    <Page style={{ paddingTop: 0 }}>
      <Stack style={{ padding: '20px' }}>
        <Routes>
          <Route
            path='/customersList'
            element={<Customers customerData={customerData} setCustomerData={data => setCustomerData(data)} />}
          />
          <Route
            path='/recurringCustomers'
            element={<RecurringCustomers customerData={customerData} setCustomerData={data => setCustomerData(data)} />}
          />
          <Route
            path='/customersList/customerProfile/*'
            element={<CustomerProfileSubRoutes customerData={customerData} setCustomerData={data => setCustomerData(data)} />}
          />
        </Routes>
      </Stack>
    </Page>
  );
}
