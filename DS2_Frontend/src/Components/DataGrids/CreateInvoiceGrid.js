import React, { useState, useEffect } from 'react';
import { Checkbox, Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function CreateInvoiceGridTable({ gridData, passedHeight, setSelectedRowsToInvoice }) {
   const [checkboxes, setCheckboxes] = useState({});
   const [textValues, setTextValues] = useState({});
   const [selectedRowIds, setSelectedRowIds] = useState([]);

   const gridProps = {
      onRowSelectionModelChange: newSelection => {
         setSelectedRowIds(newSelection || []);
      },
      checkboxSelection: true,
      pageSize: 25
   };

   const CheckboxRenderer = props => {
      const rowId = props.id;
      const field = props.field;
      const isRowSelected = selectedRowIds.includes(rowId);
      const isChecked = checkboxes[rowId] && checkboxes[rowId][field];

      return (
         <Checkbox
            disabled={!isRowSelected}
            checked={isChecked || false}
            color='primary'
            onChange={e => {
               e.stopPropagation();
               setCheckboxes(prev => ({
                  ...prev,
                  [rowId]: {
                     ...prev[rowId],
                     [field]: e.target.checked
                  }
               }));
            }}
            onClick={e => e.stopPropagation()}
         />
      );
   };

   const TextRenderer = props => {
      const rowId = props.id;
      const field = props.field;
      const value = textValues[rowId] && textValues[rowId][field];
      const isRowSelected = selectedRowIds.includes(rowId);

      return (
         <TextField
            disabled={!isRowSelected}
            variant='standard'
            size='small'
            sx={{ width: '300px' }}
            value={value || ''}
            onChange={e => {
               e.stopPropagation();
               const newText = e.target.value;
               setTextValues(prev => ({
                  ...prev,
                  [rowId]: {
                     ...prev[rowId],
                     [field]: newText
                  }
               }));
            }}
            label='(Optional) Note To Appear On Invoice'
            onKeyDown={e => {
               if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.stopPropagation();
               }
            }}
            onClick={e => e.stopPropagation()}
         />
      );
   };

   const rows = gridData.rows.map(row => ({
      ...row,
      invoiceNote: row.invoiceNote || ''
   }));

   // Extract the base columns from gridData
   const baseColumnsFromData = [...gridData.columns];

   // Define the showWriteOffs and invoiceNote columns
   const showWriteOffsColumn = {
      field: 'showWriteOffs',
      headerName: 'Show Write Offs',
      renderCell: CheckboxRenderer,
      disableClickEventBubbling: true
   };

   const invoiceNoteColumn = {
      field: 'invoiceNote',
      headerName: 'Invoice Note',
      width: 350,
      renderCell: TextRenderer,
      disableClickEventBubbling: true
   };

   // Insert the showWriteOffs column after the display_name column
   const displayNameIndex = baseColumnsFromData.findIndex(col => col.field === 'display_name');
   baseColumnsFromData.splice(displayNameIndex + 1, 0, showWriteOffsColumn);

   // Insert the invoiceNote column after the showWriteOffs column
   baseColumnsFromData.splice(displayNameIndex + 2, 0, invoiceNoteColumn);

   // Size columns based on data
   const columns = getDynamicColumnWidths(rows, baseColumnsFromData);

   useEffect(() => {
      const selectedData = rows
         .filter(row => selectedRowIds.includes(row.id))
         .map(row => {
            return {
               ...row,
               showWriteOffs: checkboxes[row.id]?.showWriteOffs || false,
               invoiceNote: textValues[row.id]?.invoiceNote || ''
            };
         });

      setSelectedRowsToInvoice(selectedData);
      // eslint-disable-next-line
   }, [selectedRowIds, checkboxes, textValues]);

   return (
      <Box sx={{ height: passedHeight ? passedHeight : 680, width: 1 }}>
         <DataGrid rows={rows} columns={columns} {...gridProps} />
      </Box>
   );
}

/**
 * Sizes columns based on data
 * @param {*} rows
 * @param {*} columns
 * @returns
 */
const getDynamicColumnWidths = (rows, columns) => {
   const ctx = document.createElement('canvas').getContext('2d');
   ctx.font = '14px Roboto';

   const basePadding = 16;

   return columns.map(column => {
      if (column.field === 'invoiceNote') {
         return { ...column, width: 350 };
      }

      if (column.field === 'showWriteOffs') {
         return { ...column, width: 150 };
      }

      if (typeof rows[0][column.field] === 'string') {
         const headerWidth = ctx.measureText(column.headerName).width;
         const maxWidth = rows.reduce((maxWidth, row) => {
            const textWidth = ctx.measureText(row[column.field] || '').width;
            return Math.max(maxWidth, textWidth);
         }, headerWidth);
         return { ...column, width: maxWidth + 35 + basePadding };
      }

      return column;
   });
};
