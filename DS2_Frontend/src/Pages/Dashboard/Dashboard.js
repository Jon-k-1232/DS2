import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function Dashboard({ setPageTitle }) {
  // eslint-disable-next-line
  useEffect(() => setPageTitle('Dashboard'), []);

  return (
    <Page>
      <Container style={{ display: 'contents' }}></Container>
    </Page>
  );
}
