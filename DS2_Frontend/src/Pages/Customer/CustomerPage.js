import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { getCustomersList } from '../../Services/ApiCalls/GetCalls';
import Page from '../../Components/Page';
import Customers from './Customers';

export default function CustomerPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    customersList: []
  });

  useEffect(() => {
    setPageTitle('Customers');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const customersList = await getCustomersList();
      setOptionLists({ customersList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ padding: '20px' }}>{menuNavigation.value === 'customers' && <Customers optionLists={optionLists} />}</Stack>
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
