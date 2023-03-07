import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';
import MenuHeader from '../../Components/MenuHeader/MenuHeader';
import { useNavigate } from 'react-router-dom';

export default function CustomerPage({ setPageTitle }) {
  const navigate = useNavigate();

  // eslint-disable-next-line
  useEffect(() => setPageTitle('Customers'), []);

  return (
    <Page>
      <MenuHeader
        menuOptions={menuOptions}
        // handle click returns object {route, value}
        handleOnClick={target => navigate(`/${target.route}`)}
      />
      <Container style={{ display: 'contents' }}></Container>
    </Page>
  );
}
const menuOptions = [
  {
    display: 'Add Customer',
    value: 'addCustomer',
    route: 'customer/addCustomer',
    icon: ''
  },
  {
    display: 'Customers',
    value: 'customers',
    route: 'customer/customers',
    icon: ''
  }
];
