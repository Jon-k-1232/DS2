import { useState } from 'react';
import { DialogContent, DialogTitle, Dialog, IconButton, Box, Tooltip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';

// Adds Custom tool bar to Grid. Allows for a plus Icon to be added to the top of the grid. along with the tools, and generalize search.
function CustomToolbar({ arrayOfButtons, title, dialogSize, hideGridTools }) {
  const [openDialog, setOpenDialog] = useState(null);

  const handleClickOpen = index => () => setOpenDialog(index);
  const handleClose = () => setOpenDialog(null);
  return (
    <GridToolbarContainer>
      {title && <Box sx={{ padding: '10px', fontSize: '18px', fontWeight: 'bold' }}>{title}</Box>}
      {arrayOfButtons &&
        arrayOfButtons.map((button, index) => (
          <div key={index}>
            <Tooltip title={button.tooltipText || 'Add'}>
              <IconButton onClick={handleClickOpen(index)}>{button.icon()}</IconButton>
            </Tooltip>
            <Dialog
              maxWidth={dialogSize ? dialogSize : 'md'}
              fullWidth
              style={{ display: 'flex', justifyContent: 'center' }}
              open={openDialog === index}
              onClose={handleClose}
            >
              <DialogTitle>{button.dialogTitle}</DialogTitle>
              <DialogContent>{button.component()}</DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <Button onClick={handleClose}>Cancel</Button>
              </Box>
            </Dialog>
          </div>
        ))}
      {hideGridTools && (
        <>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarExport />
          <div style={{ flexGrow: 1 }} />
          <GridToolbarQuickFilter
            sx={{ paddingRight: '10px' }}
            quickFilterParser={searchInput =>
              searchInput
                .split(',')
                .map(value => value.trim())
                .filter(value => value !== '')
            }
            debounceMs={100}
          />
        </>
      )}
    </GridToolbarContainer>
  );
}

export default function DataGridTable({
  tableData,
  passedHeight,
  checkboxSelection,
  enableSingleRowClick,
  setArrayOfSelectedRows,
  setSingleSelectedRow,
  routeToPass,
  arrayOfButtons,
  title,
  dialogSize,
  hideGridTools
}) {
  const navigate = useNavigate();
  const { rows, columns } = tableData;

  const gridProps = {
    density: 'compact',
    components: {
      Toolbar: props => (
        <CustomToolbar {...props} hideGridTools={!hideGridTools} arrayOfButtons={arrayOfButtons} title={title} dialogSize={dialogSize} />
      )
    },
    checkboxSelection: checkboxSelection,
    onRowSelectionModelChange: newSelection => {
      if (checkboxSelection) {
        const selectedRowsData = newSelection.map(id => rows.find(row => row.id === id));
        setArrayOfSelectedRows(selectedRowsData);
      }
    },
    onRowClick: rowData => {
      enableSingleRowClick && !routeToPass && setSingleSelectedRow(rowData.row);
      enableSingleRowClick && routeToPass && navigate(routeToPass, { state: { rowData: rowData.row } });
    },
    pageSize: 25,
    getRowId: row => row.id
  };

  const dynamicColumns = rows && columns && getDynamicColumnWidths(rows, columns);

  return (
    <Box sx={{ height: passedHeight ? passedHeight : 680, width: 1 }}>
      <DataGrid rows={rows ? rows : []} columns={columns ? dynamicColumns : []} {...gridProps} />
    </Box>
  );
}

const getDynamicColumnWidths = (rows, columns) => {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '14px Roboto';

  const basePadding = 16;

  return columns.map(column => {
    const headerWidth = ctx.measureText(column.headerName).width;
    const maxWidth = rows.reduce((maxWidth, row) => {
      const textWidth = ctx.measureText(row[column.field]).width;
      return Math.max(maxWidth, textWidth);
    }, headerWidth);
    return { ...column, width: maxWidth + 30 + basePadding };
  });
};
