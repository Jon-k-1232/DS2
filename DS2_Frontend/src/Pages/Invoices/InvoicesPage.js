import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function InvoicesPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Invoices');
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
    display: 'Create Invoice',
    value: 'createInvoice',
    route: '/invoices/createInvoice',
    icon: ''
  },
  {
    display: 'Create Qoute',
    value: 'createQoute',
    route: '/invoices/createQoute',
    icon: ''
  },
  {
    display: 'Invoices',
    value: 'invoices',
    route: '/invoices/invoices',
    icon: ''
  },
  {
    display: 'Qoutes',
    value: 'qoutes',
    route: '/invoices/qoutes'
  }
];
