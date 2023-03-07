import { useEffect } from 'react';
import { Container } from '@mui/material';
import MenuHeader from '../../Components/MenuHeader/MenuHeader';
import Page from '../../Components/Page';
import { useNavigate } from 'react-router-dom';

export default function TransactionsPage({ setPageTitle }) {
  const navigate = useNavigate();

  // eslint-disable-next-line
  useEffect(() => setPageTitle('Transactions'), []);

  return (
    <Page style={{ paddingTop: 0 }}>
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
