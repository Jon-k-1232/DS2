import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Box } from '@mui/material';
import CustomToolbar from './CustomToolbar';

const ExpandableGrid = ({
   tableData,
   passedHeight,
   checkboxSelection,
   rowSelectionOnly,
   enableSingleRowClick,
   setArrayOfSelectedRows,
   setSingleSelectedRow,
   routeToPass,
   arrayOfButtons,
   title,
   dialogSize,
   hideGridTools,
   idField,
   parentColumnName
}) => {
   const navigate = useNavigate();
   const [expandedRows, setExpandedRows] = useState(new Set());

   const { activeInvoices, treeGrid } = tableData || {};
   const { rows, columns } = treeGrid || {};

   const gridProps = {
      density: 'compact',
      components: {
         Toolbar: props => <CustomToolbar {...props} hideGridTools={!hideGridTools} arrayOfButtons={arrayOfButtons} title={title} dialogSize={dialogSize} />
      },
      checkboxSelection: checkboxSelection,
      onRowSelectionModelChange: newSelection => {
         if (checkboxSelection && !rowSelectionOnly) {
            const selectedRowsData = newSelection.map(id => activeInvoices.find(row => row[idField] === id));
            setArrayOfSelectedRows(selectedRowsData);
         }
      },
      // Stops checkbox from selecting when clicking on the row, checkbox must be specifically selected
      onCellClick: (z, e) => {
         if (!rowSelectionOnly) e.stopPropagation();
      },
      onRowClick: rowData => {
         enableSingleRowClick && !routeToPass && setSingleSelectedRow(rowData.row);
         enableSingleRowClick && routeToPass && navigate(routeToPass, { state: { rowData: rowData.row } });
      },
      pageSize: 25,
      getRowId: row => row[idField]
   };

   const handleExpandClick = (e, rowId) => {
      e.stopPropagation();
      const newExpandedRows = new Set(expandedRows);
      if (expandedRows.has(rowId)) {
         newExpandedRows.delete(rowId);
      } else {
         newExpandedRows.add(rowId);
      }
      setExpandedRows(newExpandedRows);
   };

   // Modify the columns to include the expandable icon
   const modifiedColumns = columns.map(column => {
      if (column.field === idField) {
         return {
            ...column,
            renderCell: params => {
               const isParent = params.row.children && params.row.children.length > 0;
               const isChild = params.row[parentColumnName] !== null && params.row[parentColumnName] !== params.row[idField];
               const rowId = params.row[idField];

               return (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     {isParent && (
                        <IconButton size='small' onClick={e => handleExpandClick(e, rowId)}>
                           {expandedRows.has(rowId) ? <ExpandMoreIcon style={{ color: '#00AB55' }} /> : <ExpandLessIcon style={{ color: '#00AB55' }} />}
                        </IconButton>
                     )}
                     <div style={{ paddingLeft: isChild ? '35px' : '0px' }}>{params.value}</div>
                  </div>
               );
            }
         };
      }
      return column;
   });

   // Once the row is expanded, allows for the flattening of the data to include children rows based on expanded state
   const flattenedData = [];
   rows.forEach(row => {
      flattenedData.push(row);
      if (expandedRows.has(row[idField])) {
         row.children.forEach(childRow => {
            // Create label for children rows
            flattenedData.push({ ...childRow, [idField]: childRow[idField] });
         });
         // Sort children rows by idField in ascending order the most recent will be just below the parent.
         row.children.sort((a, b) => b[idField] - a[idField]);
      }
   });

   const dynamicColumns = flattenedData && modifiedColumns && getDynamicColumnWidths(flattenedData, modifiedColumns);

   return (
      <Box sx={{ height: passedHeight ? passedHeight : 680, width: 1 }}>
         <DataGrid rows={flattenedData ? flattenedData : []} columns={columns ? dynamicColumns : []} {...gridProps} />
      </Box>
   );
};

export default ExpandableGrid;

/**
 * Sets a dynamic width based on the largest text width in the column
 * @param {*} rows
 * @param {*} columns
 * @returns
 */
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
