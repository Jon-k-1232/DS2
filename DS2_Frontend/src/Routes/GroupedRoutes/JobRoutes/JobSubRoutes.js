import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import PageNavigationHeader from '../../../Components/PageNavigationHeader/PageNavigationHeader';
import { fetchSingleJob } from '../../../Services/ApiCalls/GetCalls';
import { context } from '../../../App';
import DeleteJob from '../../../Pages/Jobs/JobForms/DeleteJob/DeleteJob';
import EditJob from '../../../Pages/Jobs/JobForms/EditJob/EditJob';

export default function JobSubRoutes({ customerData, setCustomerData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountID, userID, token } = useContext(context).loggedInUser;
  const { rowData } = location?.state ?? {};
  const { customer_job_id } = rowData ?? {};
  const menuOptions = fetchMenuOptions(navigate);

  const [jobData, setJobData] = useState({});

  useEffect(() => {
    const fetchJobData = async () => {
      if (rowData) {
        const jobData = await fetchSingleJob(customer_job_id, accountID, userID, token);
        setJobData(...jobData.activeJobData.activeJobs);
      }
    };
    fetchJobData();
    // eslint-disable-next-line
  }, [rowData]);

  return (
    <>
      <PageNavigationHeader menuOptions={menuOptions} onClickNavigation={() => {}} currentLocation={location} />

      <Routes>
        <Route
          path='deleteJob'
          element={<DeleteJob customerData={customerData} setCustomerData={data => setCustomerData(data)} jobData={jobData} />}
        />
        <Route
          path='editJob'
          element={<EditJob customerData={customerData} setCustomerData={data => setCustomerData(data)} jobData={jobData} />}
        />
      </Routes>
    </>
  );
}

const fetchMenuOptions = navigate => [
  {
    display: 'Delete Job',
    value: 'deleteJob',
    route: '/jobs/jobsList/deleteJob',
    onClick: () => navigate('/jobs/jobsList/deleteJob')
  },
  {
    display: 'Edit Job',
    value: 'editJob',
    route: '/jobs/jobsList/editJob',
    onClick: () => navigate('/jobs/jobsList/editJob')
  }
];
