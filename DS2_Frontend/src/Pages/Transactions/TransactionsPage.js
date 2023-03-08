import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function TransactionsPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Transactions');
    setMenuOptions(menuOptions);
    // eslint-disable-next-line
  }, []);

  return (
    <Page style={{ paddingTop: 0 }}>
      <Container style={{ display: 'contents' }}></Container>
    </Page>
  );
}

const menuOptions = [
  {
    display: 'Charge',
    value: 'charge',
    route: 'transactions/charge',
    icon: ''
  },
  {
    display: 'Time',
    value: 'time',
    route: 'transactions/time',
    icon: ''
  },
  {
    display: 'Payment',
    value: 'payment',
    route: 'transactions/payment',
    icon: ''
  },
  {
    display: 'Adjustment',
    value: 'adjustment',
    route: 'transactions/adjustment',
    icon: ''
  },
  {
    display: 'Write Off',
    value: 'writeOff',
    route: 'transactions/writeOff',
    icon: ''
  },
  {
    display: 'Advanced Payment',
    value: 'advancedPayment',
    route: 'transactions/advancedPayment',
    icon: ''
  },
  {
    display: 'Customer Transactions',
    value: 'customerTransactions',
    route: 'transactions/customerTransactions',
    icon: ''
  }
];
