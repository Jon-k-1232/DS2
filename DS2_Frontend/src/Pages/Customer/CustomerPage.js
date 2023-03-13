import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { getCustomersList, getRecurringCustomersList } from '../../Services/ApiCalls/GetCalls';
import Page from '../../Components/Page';
import Customers from './Customers';
import RecurringCustomers from './RecurringCustomers';
import NewCustomer from './NewCustomer';

export default function CustomerPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    customersList: [],
    recurringCustomersList: []
  });

  useEffect(() => {
    setPageTitle('Customers');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const customersList = await getCustomersList();
      const recurringCustomersList = await getRecurringCustomersList();
      setOptionLists({ customersList, recurringCustomersList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ padding: '20px' }}>
        {menuNavigation.value === 'addCustomer' && <NewCustomer />}
        {menuNavigation.value === 'customers' && <Customers optionLists={optionLists} />}
        {menuNavigation.value === 'recurringCustomers' && <RecurringCustomers optionLists={optionLists} />}
      </Stack>
    </Page>
  );
}
const menuOptions = [
  {
    display: 'Add Customer',
    value: 'addCustomer',
    route: 'customers/addCustomer',
    icon: ''
  },
  {
    display: 'Customers',
    value: 'customers',
    route: 'customers/customers',
    icon: ''
  },
  {
    display: 'Recurring Customers',
    value: 'recurringCustomers',
    route: 'customers/recurringCustomers',
    icon: ''
  }
];
