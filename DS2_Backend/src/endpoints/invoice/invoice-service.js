const invoiceService = {
  getAllInvoices(db, accountID) {
    return db('customerInvoices')
      .where('customerInvoices.accountID', accountID)
      .join('customerInvoiceDetail', 'customerInvoices.invoiceNumber', '=', 'customerInvoiceDetail.invoiceNumber')
      .join('customerInformation', 'customerInvoiceDetail.customerInformationID', '=', 'customerInformation.customerInformationID');
  },

  getCompanyInvoices(db, accountID, companyID) {
    return db('customerInvoices')
      .where('customerInvoices.accountID', accountID)
      .where('customerInvoices.companyID', companyID)
      .join('customerInvoiceDetail', 'customerInvoices.invoiceNumber', '=', 'customerInvoiceDetail.invoiceNumber')
      .join('customerInformation', 'customerInvoiceDetail.customerInformationID', '=', 'customerInformation.customerInformationID');
  },

  getOutstandingCompanyInvoices(db, accountID, companyID) {
    return db('customerInvoices').where('accountID', accountID).where('companyID', companyID).where('currentBalanceDue', '>', 0);
  },

  getTransactionsOnCompanyInvoice(db, companyDetails) {
    const { company, invoice } = companyDetails;
    return db.select().from('invoice').whereIn('invoiceNumber', [invoice]).whereIn('company', [company]);
  },

  getTransactionsOnCompanyInvoice(db, accountID, companyID, invoiceNumber) {
    return db('customerInvoices')
      .where('customerInvoices.accountID', accountID)
      .where('customerInvoices.companyID', companyID)
      .where('customerInvoices.invoiceNumber', invoiceNumber)
      .join('customerInvoiceDetail', 'customerInvoices.invoiceNumber', '=', 'customerInvoiceDetail.invoiceNumber')
      .join('customerInformation', 'customerInvoiceDetail.customerInformationID', '=', 'customerInformation.customerInformationID')
      .join('customerTransactions', 'customerInvoices.invoiceNumber', '=', 'customerTransactions.invoiceNumber');
  },

  getOutstandingInvoiceSnapshotsOnInvoice(db, accountID, customerID, invoiceNumber) {
    return db
      .select()
      .from('outstandingInvoiceSnapshots')
      .where('accountID', accountID)
      .where('customerID', customerID)
      .where('invoiceNumber', invoiceNumber);
  },

  updateTransactionInvoiceNumbers(db, invoiceNumberValue, accountID, invoiceNumber) {
    return db
      .update('invoiceNumber', invoiceNumberValue)
      .from('customerTransactions')
      .where('accountID', accountID)
      .where('invoiceNumber', invoiceNumber)
      .returning('*');
  },

  deleteInvoice(db, accountID, invoiceNumber) {
    return db.from('customerInvoices').where('accountID', accountID).where('invoiceNumber', invoiceNumber).del();
  },

  deleteInvoiceDetail(db, accountID, invoiceNumber) {
    return db.from('customerInvoiceDetail').where('accountID', accountID).where('invoiceNumber', invoiceNumber).del();
  },

  deleteTransactionSnapshots(db, accountID, invoiceNumber) {
    return db.from('customerTransactionSnapshots').where('accountID', accountID).where('invoiceNumber', invoiceNumber).del();
  },

  deleteInvoiceRetainerSnapshots(db, accountID, invoiceNumber) {
    return db.from('customerRetainerSnapshots').where('accountID', accountID).where('invoiceNumber', invoiceNumber).del();
  },

  deleteOutstandingInvoiceSnapshots(db, accountID, invoiceNumber) {
    return db.from('customerInvoiceSnapshots').where('accountID', accountID).where('invoiceNumber', invoiceNumber).del();
  }
};

module.exports = invoiceService;
