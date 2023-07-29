const dayjs = require('dayjs');

/**
 *  Format data for Mui Grid
 * @param {*} data  - Array of objects
 * @returns  - Object with columns and rows for Mui Grid
 */
const createGrid = data => {
  if (data[0]) {
    const headers = Object.keys(data[0]);

    const columns = headers.map((header, i) => ({
      field: header,
      id: i,
      headerName: header.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }));

    const rows = data.map((rowData, i) => {
      const row = {};
      headers.forEach(header => {
        row.id = i;
        row[header] = rowData[header];
      });
      return row;
    });

    return { columns, rows };
  }
  return { columns: [], rows: [] };
};

/**
 * Filter the grid by column name
 * @param {*} data - [], array of data
 * @param {*} columns - [array of strings], columns to filter by
 * @returns {} - {columns: [], rows: []}, object with columns and rows for Mui Grid
 */
const filterGridByColumnName = (data, columns) => {
  const filteredColumns = data.columns.filter(col => columns.includes(col.field));

  const filteredRows = data.rows.map(row => {
    return filteredColumns.reduce(
      (acc, col) => {
        acc[col.field] = row[col.field];
        return acc;
      },
      // Initialize with the 'id' field
      { id: row.id }
    );
  });

  return {
    columns: filteredColumns,
    rows: filteredRows
  };
};

module.exports = { createGrid, filterGridByColumnName };
