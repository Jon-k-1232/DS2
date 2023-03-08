import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function JobsPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  // eslint-disable-next-line
  useEffect(() => {
    setPageTitle('Jobs');
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
    display: 'Create Job',
    value: 'addJob',
    route: '/jobs/add',
    icon: ''
  },
  {
    display: 'Create Job Option',
    value: 'addJobOption',
    route: '/jobs/addJobOption'
  },
  {
    display: 'Create Job Catagory',
    value: 'addJobCatagory',
    route: '/jobs/addJobCatagory'
  },
  {
    display: 'Jobs',
    value: 'jobs',
    route: '/jobs/jobs',
    icon: ''
  },
  {
    display: 'Job Options',
    value: 'jobOptions',
    route: '/jobs/jobOptions'
  },
  {
    display: 'Job Catagories',
    value: 'jobCatagories',
    route: '/jobs/jobCatagories',
    icon: ''
  }
];
