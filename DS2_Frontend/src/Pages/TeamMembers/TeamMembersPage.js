import { useEffect } from 'react';
import { Container } from '@mui/material';
import Page from '../../Components/Page';

export default function TeamMembersPage({ setPageTitle, setMenuOptions, menuNavigation }) {
  useEffect(() => {
    setPageTitle('Team Members');
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
