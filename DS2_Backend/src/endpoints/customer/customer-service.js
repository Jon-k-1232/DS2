const customerService = {
  getAccountContacts(db, accountID) {
    return db
      .from('customer')
      .where('accountID', accountID)
      .join('customerInformation', 'customerInformation.customerID', '=', 'customer.customerID')
      .where('customerInformation.isCustomerAddressActive', true);
  },

  getActiveAccountCustomers(db, accountID) {
    return db
      .from('customer')
      .where('accountID', accountID)
      .where('customer.isCustomerActive', true)
      .join('customerInformation', 'customerInformation.customerID', '=', 'customer.customerID')
      .where('customerInformation.isCustomerAddressActive', true);
  },

  getPriorCustomers(db, accountID) {
    return db
      .from('customer')
      .where('accountID', accountID)
      .where('customer.isCustomerActive', true)
      .join('customerInformation', 'customerInformation.customerID', '=', 'customer.customerID')
      .where('customerInformation.isCustomerAddressActive', false);
  },

  insertNewCustomer(db, customer) {
    return db.insert(customer).into('customer').returning('*');
  },

  insertNewCustomerInformation(db, customerInformation) {
    return db.insert(customerInformation).into('customerInformation').returning('*');
  },

  updateCustomer(db, updatedContact, customerID, accountID) {
    return db.update(updatedContact).from('customer').where('customerID', customerID).where('accountID', accountID);
  },

  updateCustomerInformation(db, updatedContactInformation, customerID, accountID) {
    return db.update(updatedContactInformation).from('customerInformation').where('customerID', customerID).where('accountID', accountID);
  },

  deactivateCustomer(db, customerID, accountID) {
    return db.update('isCustomerActive', false).from('customer').where('customerID', customerID).where('accountID', accountID);
  }
};

module.exports = customerService;
