import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function Dashboard({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Dashboard');
    setMenuOptions(menuOptions);
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Container style={{ display: 'contents' }}></Container>
    </Page>
  );
}

const menuOptions = [];
