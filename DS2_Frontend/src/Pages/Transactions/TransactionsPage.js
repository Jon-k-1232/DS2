import { useEffect, useState } from 'react';
import { getCustomersList, getCustomerJobsList, getTeamMembersList, getTransactionsList } from '../../Services/ApiCalls/GetCalls';
import { Stack } from '@mui/material';
import Page from '../../Components/Page';
import Charge from './Charge';
import Time from './Time';
import Payment from './Payment';
import WriteOff from './WriteOff';
import TransactionTable from './Transactions';
import ComingSoon from '../../Components/ComingSoon';

export default function TransactionsPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    customersList: [],
    customerJobsList: [],
    teamMembersList: [],
    transactionsList: []
  });

  useEffect(() => {
    setPageTitle('Transactions');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const customersList = await getCustomersList();
      const customerJobsList = await getCustomerJobsList();
      const teamMembersList = await getTeamMembersList();
      const transactionsList = await getTransactionsList();

      setOptionLists({ customersList, customerJobsList, teamMembersList, transactionsList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page style={{ paddingTop: 0 }}>
      <Stack style={{ padding: '20px' }}>
        {menuNavigation.value === 'newTime' && <Time optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />}
        {/* {menuNavigation.value === 'newCharge' && <Charge optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />}
        {menuNavigation.value === 'newPayment' && <Payment optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />}
        {menuNavigation.value === 'writeOff' && <WriteOff optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />}
        {menuNavigation.value === 'customerTransactions' && <TransactionTable transactionsList={optionLists.transactionsList} />} */}
        <Charge optionLists={optionLists} setOptionLists={data => setOptionLists(data)} />
      </Stack>
    </Page>
  );
}

const menuOptions = [
  {
    display: 'New Time',
    value: 'newTime',
    route: 'transactions/newTime'
  },
  {
    display: 'New Charge',
    value: 'newCharge',
    route: 'transactions/newCharge'
  },
  {
    display: 'New Payment',
    value: 'newPayment',
    route: 'transactions/newPayment'
  },
  {
    display: 'Write Off Transaction',
    value: 'writeOff',
    route: 'transactions/writeOffTransaction'
  },
  {
    display: 'Transactions',
    value: 'customerTransactions',
    route: 'transactions/customerTransactions'
  }
];
