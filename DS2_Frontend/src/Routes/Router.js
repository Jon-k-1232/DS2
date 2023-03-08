import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '../Layouts/Drawer';
import LogoOnlyLayout from '../Layouts/LogoOnlyLayout';
import NotFound from '../Pages/Page404/Page404';
import Dashboard from '../Pages/Dashboard/Dashboard';
import CustomerPage from '../Pages/Customer/CustomerPage';
import TransactionsPage from '../Pages/Transactions/TransactionsPage';
import InvoicesPage from '../Pages/Invoices/InvoicesPage';
import AccountPage from '../Pages/Account/AccountPage';
import JobsPage from '../Pages/Jobs/JobsPage';
import TeamMembersPage from '../Pages/TeamMembers/TeamMembersPage';

export default function Router() {
  const [pageTitle, setPageTitle] = useState('');
  const [menuOptions, setMenuOptions] = useState([]);
  const [menuNavigation, setMenuNavigation] = useState({});

  return (
    <Routes>
      <Route element={<LogoOnlyLayout />}>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' />} />
      </Route>

      {/* Any route that goes through DashboardLayout will be checked by Private Route component */}
      <Route
        element={<DashboardLayout pageTitle={pageTitle} menuOptions={menuOptions} onClickNavigation={nav => setMenuNavigation(nav)} />}
      >
        <Route
          path='dashboard'
          element={
            <Dashboard
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
        <Route
          path='customers'
          element={
            <CustomerPage
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
        <Route
          path='transactions'
          element={
            <TransactionsPage
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
        <Route
          path='invoices'
          element={
            <InvoicesPage
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
        <Route
          path='account'
          element={
            <AccountPage
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
        <Route
          path='jobs'
          element={
            <JobsPage
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
        <Route
          path='teamMembers'
          element={
            <TeamMembersPage
              setPageTitle={pageTitle => setPageTitle(pageTitle)}
              setMenuOptions={options => setMenuOptions(options)}
              menuNavigation={menuNavigation}
            />
          }
        />
      </Route>
    </Routes>
  );
}
