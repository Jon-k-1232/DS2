import dayjs from 'dayjs';

/**
 * The backend Api generally gives all the column data nd row data. this will allow a user to specify what columns they want.
 * @param {*} data
 * @param {*} columns - when passing column names, id is required
 * @returns  {object} - returns an object with the columns and rows filtered based on user input
 */
export const filterGridByColumnName = (data, columns) => {
  const filteredColumns = data.columns.filter(col => columns.includes(col.field));

  const filteredRows = data.rows.map(row => {
    return filteredColumns.reduce(
      (acc, col) => {
        // Check if the value is a date string
        if (dayjs(row[col.field], 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
          // If it is, format it to "MM DD YYYY h:mm A"
          acc[col.field] = dayjs(row[col.field]).format('MMMM D, YYYY hh:mm A');
        } else {
          acc[col.field] = row[col.field];
        }
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

/**
 * formats the total
 * @param {*} value
 * @returns
 */
export const formatTotal = value => {
  return value
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
