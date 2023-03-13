import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { getAccountUsersList } from '../../Services/ApiCalls/GetCalls';
import Page from '../../Components/Page';
import AccountUsers from './AccountUsers';

export default function AccountPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    accountUsersList: []
  });

  useEffect(() => {
    setPageTitle('Account');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const accountUsersList = await getAccountUsersList();
      setOptionLists({ accountUsersList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ padding: '20px' }}>{menuNavigation.value === 'accountUsers' && <AccountUsers optionLists={optionLists} />}</Stack>
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
