import { useEffect } from 'react';
import { Stack } from '@mui/material';
import Page from '../../Components/Page';

export default function InvoicesPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Invoices');
    setMenuOptions(menuOptions);
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ display: 'contents' }}></Stack>
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
    display: 'Create Quote',
    value: 'createQuote',
    route: '/invoices/createQuote',
    icon: ''
  },
  {
    display: 'Invoices',
    value: 'invoices',
    route: '/invoices/invoices',
    icon: ''
  },
  {
    display: 'Quotes',
    value: 'quotes',
    route: '/invoices/quotes'
  }
];
