import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DataGridTable({ tableData, passedHeight, checkboxSelection, setArrayOfSelectedRows, setSingleSelectedRow }) {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100
  });

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(() => data.columns.filter(column => VISIBLE_FIELDS.includes(column.field)), [data.columns]);

  const gridProps = {
    density: 'compact',
    loading: !tableData && !data ? true : false,
    initialState: {
      pagination: {
        // pageSize: 25,50,or 100. No larger than 100
        paginationModel: { pageSize: 25, page: 0 }
      }
    },
    columns: columns,
    slots: { toolbar: GridToolbar },
    slotProps: {
      toolbar: {
        showQuickFilter: true,
        quickFilterProps: { debounceMs: 500 }
      }
    },
    checkboxSelection: checkboxSelection,
    // Multiple row IDs [ID'S OF ROWS]. row id types = int
    onRowSelectionModelChange: rowsSelected => {
      // ToDO eventually convert to ints once data plugged in
      const rowIDs = rowsSelected;
      checkboxSelection && setArrayOfSelectedRows(rowIDs);
    },
    // Single row data = {columns,id,row}
    onRowClick: rowData => setSingleSelectedRow(rowData)
  };

  return (
    <Box sx={{ height: passedHeight ? passedHeight : 680, width: 1 }}>
      <DataGrid {...data} {...gridProps} />
    </Box>
  );
}
