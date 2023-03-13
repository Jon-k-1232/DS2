import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { getTeamList } from '../../Services/ApiCalls/GetCalls';
import Page from '../../Components/Page';
import Team from './Team';

export default function TeamMembersPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  const [optionLists, setOptionLists] = useState({
    teamList: []
  });

  useEffect(() => {
    setPageTitle('Team Members');
    setMenuOptions(menuOptions);

    const apiCall = async () => {
      const teamList = await getTeamList();

      setOptionLists({ teamList });
    };
    apiCall();
    // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <Stack style={{ padding: '20px' }}>{menuNavigation.value === 'team' && <Team optionLists={optionLists} />}</Stack>
    </Page>
  );
}

const menuOptions = [
  {
    display: 'Add Team Member',
    value: 'addTeamMember',
    route: '/teamMembers/addTeamMember',
    icon: ''
  },
  {
    display: 'Team',
    value: 'team',
    route: '/teamMembers/team',
    icon: ''
  }
];
