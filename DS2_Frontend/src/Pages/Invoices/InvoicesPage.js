import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Page from '../../Components/Page';
import { getInvoicesList, getQuotesList } from '../../Services/ApiCalls/GetCalls';
import Invoices from './Invoices';
import Quotes from './Quotes';

export default function InvoicesPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    invoicesList: [],
    quotesList: []
  });

  useEffect(() => {
    setPageTitle('Invoices');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const invoicesList = await getInvoicesList();
      const quotesList = await getQuotesList();
      setOptionLists({ invoicesList, quotesList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ padding: '20px' }}>
        {menuNavigation.value === 'invoices' && <Invoices optionLists={optionLists} />}
        {menuNavigation.value === 'quotes' && <Quotes optionLists={optionLists} />}
      </Stack>
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
