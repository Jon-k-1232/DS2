import React, { useState, useContext } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import InitialSelectionOptions from './FormSubComponents/InitialSelectionOptions';
import { postNewWriteOff } from '../../../../Services/ApiCalls/PostCalls';
import WriteOffOptions from './FormSubComponents/WriteOffOptions';
import { formObjectForWriteOffPost } from '../../../../Services/SharedPostObjects/SharedPostObjects';
import dayjs from 'dayjs';
import { context } from '../../../../App';
import InformationDialog from '../../../../Components/Dialogs/InformationDialog';
import { formatTotal } from '../../../../Services/SharedFunctions';

const initialState = {
   selectedCustomer: null,
   selectedJob: null,
   selectedTeamMember: null,
   writeoffReason: '',
   selectedDate: dayjs(),
   unitCost: 0,
   quantity: 1
};

export default function WriteOff({ customerData, setCustomerData }) {
   const { loggedInUser } = useContext(context);
   const { accountID, userID } = loggedInUser;

   const [postStatus, setPostStatus] = useState(null);
   const [selectedItems, setSelectedItems] = useState(initialState);

   const { unitCost, quantity } = selectedItems;

   const handleSubmit = async () => {
      const dataToPost = formObjectForWriteOffPost(selectedItems, loggedInUser, 'WriteOff');
      const postedItem = await postNewWriteOff(dataToPost, accountID, userID);

      setPostStatus(postedItem);

      if (postedItem.status === 200) {
         setTimeout(() => setPostStatus(null), 2000);
         setSelectedItems(initialState);
         setCustomerData({ ...customerData, writeOffsList: postedItem.writeOffsList });
      }
   };

   return (
      <>
         <Box sx={{ display: 'grid', gap: 3 }}>
            <InformationDialog dialogText={helpText} dialogTitle='Write Off Help' toolTipText={'Info'} buttonLocation={{ position: 'absolute', top: '1em', right: '1em', cursor: 'pointer' }} />

            <InitialSelectionOptions
               customerData={customerData}
               setCustomerData={data => setCustomerData(data)}
               selectedItems={selectedItems}
               setSelectedItems={data => setSelectedItems(data)}
               initialState={initialState}
            />

            <WriteOffOptions selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />

            <Typography>Total: {formatTotal(quantity * unitCost)}</Typography>

            <Box style={{ textAlign: 'center' }}>
               <Button onClick={handleSubmit}>Submit</Button>
               {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
            </Box>
         </Box>
      </>
   );
}

const helpText = [
   'Adjustments are not currently supported. You can either write off a portion or the entire amount of a job.',
   'If you need to adjust a transaction, please edit or delete the transaction directly from the transactions list.',
   'When writing off, only provide the ID for an Invoice or select a Job. Do not provide both. In most cases, you will want to write off a Job.',
   'Currently, you are required to provide the ID of the invoice you want to write off.',
   'Definition of a Write Off: The inability to collect payment from a customer for a job that has been completed.'
];
