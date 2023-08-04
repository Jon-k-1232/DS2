import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import PageNavigationHeader from '../../../Components/PageNavigationHeader/PageNavigationHeader';
import { fetchCustomerProfileInformation } from '../../../Services/ApiCalls/FetchCalls';
import CustomerProfile from '../../../Pages/Customer/CustomerProfile/CustomerProfile';
import CustomerProfileInvoices from '../../../Pages/Customer/CustomerProfile/CustomerProfileInvoices';
import CustomerProfileTransactions from '../../../Pages/Customer/CustomerProfile/CustomerProfileTransactions';
import CustomerProfileJobs from '../../../Pages/Customer/CustomerProfile/CustomerProfileJobs';
import EditCustomerProfile from '../../../Pages/Customer/CustomerProfile/EditCustomerProfile';
import CustomerRetainers from '../../../Pages/Customer/CustomerProfile/CustomerRetainers';
import { useContext } from 'react';
import { context } from '../../../App';

export default function CustomerProfileSubRoutes({ customerData, setCustomerData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountID, userID, token } = useContext(context).loggedInUser;
  const menuOptions = fetchMenuOptions(navigate);
  const { rowData } = location?.state ?? {};

  const [profileData, setProfileData] = useState({});
  const [callProfileData, setCallProfileData] = useState(new Date());
  const [customerInfoID, setCustomerInfoID] = useState(null);

  useEffect(() => {
    if (rowData || customerInfoID) {
      const apiCall = async () => {
        const customerID = rowData?.customer_id || customerInfoID;

        const fetchCustomerInformation = await fetchCustomerProfileInformation(accountID, userID, customerID, token);
        setProfileData({ ...fetchCustomerInformation });
        setCustomerInfoID(customerID);
      };
      apiCall();
    }
    // eslint-disable-next-line
  }, [callProfileData]);

  return (
    <>
      <PageNavigationHeader menuOptions={menuOptions} onClickNavigation={() => {}} currentLocation={location} />

      {location.pathname !== '/customers/customersList/customerProfile/editCustomerProfile' && (
        <CustomerProfile profileData={profileData} />
      )}

      <Routes>
        <Route path='customerInvoices' element={<CustomerProfileInvoices profileData={profileData} />} />
        <Route path='customerTransactions' element={<CustomerProfileTransactions profileData={profileData} />} />
        <Route path='customerJobs' element={<CustomerProfileJobs profileData={profileData} setCustomerData={setCustomerData} />} />
        <Route path='retainersAndPrePayments' element={<CustomerRetainers profileData={profileData} />} />
        <Route
          path='editCustomerProfile'
          element={
            <EditCustomerProfile
              profileData={profileData}
              setProfileData={data => setProfileData({ ...profileData, data })}
              customerData={customerData}
              setCustomerData={data => setCustomerData(data)}
              setCallProfileData={data => setCallProfileData(data)}
            />
          }
        />
      </Routes>
    </>
  );
}

const fetchMenuOptions = navigate => [
  {
    display: 'Invoices',
    value: 'customerInvoices',
    route: '/customers/customersList/customerProfile/customerInvoices',
    onClick: () => navigate('/customers/customersList/customerProfile/customerInvoices')
  },
  {
    display: 'Transactions',
    value: 'customerTransactions',
    route: '/customers/customersList/customerProfile/customerTransactions',
    onClick: () => navigate('/customers/customersList/customerProfile/customerTransactions')
  },
  {
    display: 'Jobs',
    value: 'customerJobs',
    route: '/customers/customersList/customerProfile/customerJobs',
    onClick: () => navigate('/customers/customersList/customerProfile/customerJobs')
  },
  {
    display: 'Retainers and PrePayments',
    value: 'retainersAndPrePayments',
    route: '/customers/customersList/customerProfile/retainersAndPrePayments',
    onClick: () => navigate('/customers/customersList/customerProfile/retainersAndPrePayments')
  },
  {
    display: 'Edit Customer Profile',
    value: 'editCustomerProfile',
    route: '/customers/customersList/customerProfile/editCustomerProfile',
    onClick: () => navigate('/customers/customersList/customerProfile/editCustomerProfile')
  }
];
