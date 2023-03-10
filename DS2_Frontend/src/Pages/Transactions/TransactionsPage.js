import { useEffect, useState } from 'react';
import { getCustomersList, getCustomerJobsList, getTeamMembersList } from '../../Services/ApiCalls/GetCalls';
import { Stack } from '@mui/material';
import Page from '../../Components/Page';
import Charge from './Charge';
import Time from './Time';

export default function TransactionsPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({});

  useEffect(() => {
    setPageTitle('Transactions');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const customersList = await getCustomersList();
      const customerJobsList = await getCustomerJobsList();
      const teamMembersList = await getTeamMembersList();

      setOptionLists({ customersList, customerJobsList, teamMembersList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page style={{ paddingTop: 0 }}>
      <Stack style={{ padding: '20px' }}>
        {menuNavigation.value === 'newCharge' && <Charge optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />}
        {menuNavigation.value === 'newTime' && <Time optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />}
      </Stack>
    </Page>
  );
}

const menuOptions = [
  {
    display: 'New Time',
    value: 'newTime',
    route: 'transactions/newTime',
    icon: ''
  },
  {
    display: 'New Charge',
    value: 'newCharge',
    route: 'transactions/newCharge',
    icon: ''
  },
  {
    display: 'New Payment',
    value: 'newPayment',
    route: 'transactions/newPayment',
    icon: ''
  },
  {
    display: 'Write Off Transaction',
    value: 'writeOffTransaction',
    route: 'transactions/writeOffTransaction',
    icon: ''
  },
  {
    display: 'Edit Transaction',
    value: 'editTransaction',
    route: 'transactions/editTransaction',
    icon: ''
  },
  {
    display: 'Delete Transaction',
    value: 'deleteTransaction',
    route: 'transactions/deleteTransaction',
    icon: ''
  },
  {
    display: 'Transactions',
    value: 'customerTransactions',
    route: 'transactions/customerTransactions',
    icon: ''
  }
];
