const { createGrid, generateTreeGridData } = require('../../helperFunctions/helperFunctions');

// Creating a centralized file to help with keeping order to objects across the different endpoints.

const createInvoiceReturnObject = {
   activeInvoiceData: activeInvoices => ({
      activeInvoices,
      grid: createGrid(activeInvoices),
      treeGrid: generateTreeGridData(activeInvoices, 'customer_invoice_id', 'parent_invoice_id')
   })
};

module.exports = createInvoiceReturnObject;
