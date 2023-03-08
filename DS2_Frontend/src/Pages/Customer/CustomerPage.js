import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function CustomerPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Customers');
    setMenuOptions(menuOptions);
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Container style={{ display: 'contents' }}></Container>
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
