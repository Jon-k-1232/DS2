import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import printerFill from '@iconify/icons-eva/printer-fill';
import baselineWork from '@iconify/icons-ic/baseline-work';

const getIcon = name => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Transactions',
    path: '/transactions',
    icon: getIcon(clockFill)
  },
  {
    title: 'Invoices',
    path: '/invoices',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Jobs',
    path: '/jobs',
    icon: getIcon(baselineWork)
  },
  {
    title: 'Team Members',
    path: '/teamMembers',
    icon: getIcon(baselineWork)
  },
  {
    title: 'Account',
    path: '/account',
    icon: getIcon(printerFill)
  }
];

export default sidebarConfig;
