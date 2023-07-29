import { useState } from 'react';
import { Stack, Button, Alert, Box } from '@mui/material';
import TeamMemberName from './FormSubComponents/TeamMemberNameForm';
import AccessSelections from './FormSubComponents/AccessSelections';
import RateSelections from './FormSubComponents/RateSelections';
import UserLoginSelections from './FormSubComponents/UserLoginSelections';
import { postNewTeamMember } from '../../../../Services/ApiCalls/PostCalls';
import { formObjectForTeamMemberPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import { useContext } from 'react';
import { context } from '../../../../App';

const initialState = {
  userFirstName: '',
  userLastName: '',
  userDisplayName: '',
  userEmail: '',
  costRate: 0,
  billingRate: 0,
  role: '',
  accessLevel: null,
  userLoginName: '',
  userLoginPassword: ''
};

export default function AddUser({ customerData, setCustomerData }) {
  const { loggedInUser } = useContext(context);
  const { accountID, userID } = useContext(context).loggedInUser;

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState(initialState);

  const handleSubmit = async () => {
    const dataToPost = formObjectForTeamMemberPost(selectedItems, loggedInUser);
    const postedItem = await postNewTeamMember(dataToPost, accountID, userID);

    setPostStatus(postedItem);
    if (postedItem.status === 200) resetState(postedItem);
  };

  const resetState = postedItem => {
    setCustomerData({ ...customerData, teamMembersList: postedItem.teamMembersList });
    setSelectedItems(initialState);
    setTimeout(() => setPostStatus(null), 4000);
  };

  return (
    <>
      <Stack spacing={3}>
        <TeamMemberName selectedItems={selectedItems} setSelectedItems={e => setSelectedItems(e)} />
        <RateSelections selectedItems={selectedItems} setSelectedItems={e => setSelectedItems(e)} />
        <AccessSelections selectedItems={selectedItems} setSelectedItems={e => setSelectedItems(e)} />
        <UserLoginSelections selectedItems={selectedItems} setSelectedItems={e => setSelectedItems(e)} />

        <Box style={{ textAlign: 'center' }}>
          <Button onClick={handleSubmit}>Submit</Button>
          {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
        </Box>
      </Stack>
    </>
  );
}
