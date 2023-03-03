import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '../Layouts/Drawer';
import LogoOnlyLayout from '../Layouts/LogoOnlyLayout';
import NotFound from '../Pages/Page404/Page404';
import Dashboard from '../Pages/Dashboard/Dashboard';
import CustomerPage from '../Pages/Customer/CustomerPage';
// import { useContext } from 'react';
// import { context } from '../App';
// import AccessControl from 'src/Pages/Access/Access';

export default function Router() {
  // const { loginUser } = useContext(context);

  return (
    <Routes>
      <Route element={<LogoOnlyLayout />}>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' />} />
      </Route>

      {/* Any route that goes through DashboardLayout will be checked by Private Route component */}
      <Route element={<DashboardLayout />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='customers' element={<CustomerPage />} />
      </Route>
    </Routes>
  );
}
