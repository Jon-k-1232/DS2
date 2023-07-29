import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import PageNavigationHeader from '../../../Components/PageNavigationHeader/PageNavigationHeader';
import { fetchSingleWriteOff } from '../../../Services/ApiCalls/GetCalls';
import { context } from '../../../App';
import DeleteWriteOff from '../../../Pages/Transactions/TransactionForms/DeleteTransaction/DeleteWriteOff';
import EditWriteOff from '../../../Pages/Transactions/TransactionForms/EditTransaction/EditWriteOff';

export default function WriteOffSubRoutes({ customerData, setCustomerData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountID, userID } = useContext(context).loggedInUser;
  const { rowData } = location?.state ?? {};
  const { writeoff_id } = rowData ?? {};
  const menuOptions = fetchMenuOptions(navigate);

  const [writeOffData, setWriteOffData] = useState({});

  useEffect(() => {
    const fetchWriteOffData = async () => {
      if (rowData) {
        const fetchPayment = await fetchSingleWriteOff(writeoff_id, accountID, userID);
        setWriteOffData(...fetchPayment.activeWriteOffsData.activeWriteOffs);
      }
    };
    fetchWriteOffData();
    // eslint-disable-next-line
  }, [rowData]);

  return (
    <>
      <PageNavigationHeader menuOptions={menuOptions} onClickNavigation={() => {}} currentLocation={location} />

      <Routes>
        <Route
          path='deleteWriteOff'
          element={
            <DeleteWriteOff customerData={customerData} setCustomerData={data => setCustomerData(data)} writeOffData={writeOffData} />
          }
        />
        <Route
          path='editWriteOff'
          element={<EditWriteOff customerData={customerData} setCustomerData={data => setCustomerData(data)} writeOffData={writeOffData} />}
        />
      </Routes>
    </>
  );
}

const fetchMenuOptions = navigate => [
  {
    display: 'Delete Write Off',
    value: 'deleteWriteOff',
    route: '/transactions/customerWriteOffs/deleteWriteOff',
    onClick: () => navigate('/transactions/customerWriteOffs/deleteWriteOff')
  },
  {
    display: 'Edit Write Off',
    value: 'editWriteOff',
    route: '/transactions/customerWriteOffs/editWriteOff',
    onClick: () => navigate('/transactions/customerWriteOffs/editWriteOff')
  }
];
