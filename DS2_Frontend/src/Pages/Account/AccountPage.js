import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function AccountPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Account');
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
    display: 'Account Contact Settings',
    value: 'accountContactSettings',
    route: 'account/accountContactSettings',
    icon: ''
  },
  {
    display: 'Payment Remittance Settings',
    value: 'paymentRemittanceSettings',
    route: 'account/paymentRemittanceSettings',
    icon: ''
  },
  {
    display: 'Account LogIn Settings',
    value: 'accountLogInSettings',
    route: 'account/accountLogInSettings',
    icon: ''
  },
  {
    display: 'Account Users',
    value: 'accountUsers',
    route: 'account/accountUsers',
    icon: ''
  }
];
