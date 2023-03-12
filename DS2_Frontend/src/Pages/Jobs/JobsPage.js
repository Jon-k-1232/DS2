import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { getJobsList, getJobsCatagoriesList, getJobOptionsList } from '../../Services/ApiCalls/GetCalls';
import Page from '../../Components/Page';
import Jobs from './Jobs';
import JobCatagories from './JobCatagories';
import JobOptions from './JobOptions';

export default function JobsPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    jobsList: [],
    jobsCatagoriesList: [],
    jobOptionsList: []
  });

  useEffect(() => {
    setPageTitle('Jobs');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const jobsList = await getJobsList();
      const jobsCatagoriesList = await getJobsCatagoriesList();
      const jobOptionsList = await getJobOptionsList();
      setOptionLists({ jobsList, jobsCatagoriesList, jobOptionsList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ padding: '20px' }}>
        {menuNavigation.value === 'jobs' && <Jobs optionLists={optionLists} />}
        {menuNavigation.value === 'jobCatagories' && <JobCatagories optionLists={optionLists} />}
        {menuNavigation.value === 'jobOptions' && <JobOptions optionLists={optionLists} />}
      </Stack>
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
