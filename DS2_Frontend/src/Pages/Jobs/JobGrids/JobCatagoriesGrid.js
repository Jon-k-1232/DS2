import { Stack } from '@mui/material';
import DataGridTable from '../../../Components/DataGrids/DataGrid';
import NewJobCategory from '../JobForms/AddJob/NewJobCategory';
import AddIcon from '@mui/icons-material/Add';
import palette from '../../../Theme/palette';

export default function JobCatagoriesGrid({ customerData, setCustomerData }) {
  const { jobCategoriesList: { activeJobCategoriesData = {} } = {} } = customerData || {};

  if (!customerData || !customerData.jobCategoriesList || !customerData.jobCategoriesList.activeJobCategoriesData) {
    // Render a loading indicator or an empty state here
    return <div>Loading...</div>;
  }

  const gridButtons = [
    {
      dialogTitle: 'New Job Category',
      tooltipText: 'Add a New Job Category',
      icon: () => <AddIcon style={{ color: palette.primary.main }} />,
      component: () => <NewJobCategory customerData={customerData} setCustomerData={data => setCustomerData(data)} />
    }
  ];

  return (
    <>
      <Stack spacing={3}>
        <DataGridTable
          title='Job Categories'
          tableData={activeJobCategoriesData.grid}
          checkboxSelection={false}
          arrayOfButtons={gridButtons}
        />
      </Stack>
    </>
  );
}
