import React, { useState } from 'react';
import { Stack, Button, Alert } from '@mui/material';
import NameForm from './CustomerForms/NameForm';
import AddressForm from './CustomerForms/AddressForm';
import CustomerSettings from './CustomerForms/CustomerSettings';
import CustomerEntityType from './CustomerForms/CustomerEntityType';
import { formObjectForCustomerPost } from '../../Services/SharedPostObjects/SharedPostObjects';
import { postNewCustomer } from '../../Services/ApiCalls/PostCalls';
import AddressTypeSelections from './CustomerForms/AddressTypeSelections';
import { useContext } from 'react';
import { context } from '../../App';
import RecurringCustomerForm from './CustomerForms/RecurringCustomerForm';

export default function NewCustomer() {
  const { loggedInUser } = useContext(context);

  const [postStatus, setPostStatus] = useState(null);
  const [selectedItems, setSelectedItems] = useState({
    customerEntityType: 'individual',
    recurringAmount: '',
    billingCycle: '',
    customerBusinessName: '',
    customerName: '',
    customerFirstName: '',
    customerLastName: '',
    customerStreet: '',
    customerCity: '',
    customerState: '',
    customerZip: '',
    customerPhone: '',
    customerEmail: '',
    isCustomerAddressActive: true,
    isCustomerPhysicalAddress: true,
    isCustomerBillingAddress: true,
    isCustomerMailingAddress: true,
    isCustomerActive: true,
    isCustomerBillable: true,
    isCustomerRecurring: false
  });

  const { isCustomerRecurring } = selectedItems;

  const handleSubmit = async () => {
    const dataToPost = formObjectForCustomerPost(selectedItems, loggedInUser);
    console.log(dataToPost);

    const postedItem = await postNewCustomer(dataToPost);
    setPostStatus(postedItem.status);
    if (postStatus === 200) {
      resetState();
    }
  };

  const resetState = () => {
    setPostStatus(null);
    setSelectedItems({
      customerEntityType: 'individual',
      recurringAmount: '',
      billingCycle: '',
      customerBusinessName: '',
      customerName: '',
      customerFirstName: '',
      customerLastName: '',
      customerStreet: '',
      customerCity: '',
      customerState: '',
      customerZip: '',
      customerPhone: '',
      customerEmail: '',
      isCustomerAddressActive: true,
      isCustomerPhysicalAddress: true,
      isCustomerBillingAddress: true,
      isCustomerMailingAddress: true,
      isCustomerActive: true,
      isCustomerBillable: true,
      isCustomerRecurring: false
    });
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
          <CustomerEntityType selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
          <NameForm selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
          <AddressTypeSelections selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} style={{ marginTop: 0 }}>
          <AddressForm selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
          <CustomerSettings selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
        </Stack>

        {isCustomerRecurring && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
            <RecurringCustomerForm selectedItems={selectedItems} setSelectedItems={data => setSelectedItems(data)} />
          </Stack>
        )}

        <Stack>
          <Button onClick={handleSubmit}>Primary</Button>
          {postStatus && <Alert severity={postStatus === 200 ? 'success' : 'error'}>{postStatus}</Alert>}
        </Stack>
      </Stack>
    </>
  );
}
