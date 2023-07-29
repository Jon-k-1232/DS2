const invoiceService = {
  // Must stay desc, used in finding if an invoice has to be created
  getInvoices(db, accountID) {
    return db.select('*').from('customer_invoices').where('account_id', accountID).orderBy('invoice_date', 'desc');
  },

  getCustomerInvoiceByID(db, accountID, customerID) {
    return db
      .select('*')
      .from('customer_invoices')
      .where('account_id', accountID)
      .andWhere('customer_id', customerID)
      .orderBy('invoice_date', 'desc');
  },

  // Create an invoice
  createInvoice(db, invoice) {
    return db
      .insert(invoice)
      .into('customer_invoices')
      .returning('*')
      .then(rows => rows[0]);
  },

  // Delete an invoice
  deleteInvoice(db, invoiceID) {
    return db
      .from('customer_invoices')
      .where('invoice_id', invoiceID)
      .delete()
      .then(rows => rows[0]);
  },

  // Update an invoice
  updateInvoice(db, invoice) {
    return db
      .from('customer_invoices')
      .where('invoice_id', invoice.invoice_id)
      .update(invoice)
      .then(rows => rows[0]);
  },

  // getContactInfoForArrayOfCustomers(db, accountID, customerIDs) {
  //   return db
  //     .select(
  //       'customers.*',
  //       'customer_information.customer_street',
  //       'customer_information.customer_city',
  //       'customer_information.customer_state',
  //       'customer_information.customer_zip',
  //       'customer_information.customer_email',
  //       'customer_information.customer_phone'
  //     )
  //     .from('customers')
  //     .leftJoin('customer_information', function () {
  //       this.on('customers.customer_id', '=', 'customer_information.customer_id')
  //         .andOn('customer_information.is_customer_mailing_address', db.raw('?', [true]))
  //         .andOn('customer_information.is_this_address_active', db.raw('?', [true]));
  //     })
  //     .whereIn('customers.customer_id', customerIDs)
  //     .where('customers.account_id', accountID)
  //     .orderBy('customers.customer_name', 'asc');
  // },

  // For each invoice for each customer, it will join the payment table and group by invoice id
  getInvoicesForArrayOfCustomers(db, accountID, customerIDs) {
    return db
      .select(
        'customer_invoices.*',
        db.raw('COALESCE(customer_payments.payment_date, NULL) as payment_date'),
        db.raw('COALESCE(customer_payments.payment_amount, NULL) as payment_amount')
      )
      .from('customer_invoices')
      .whereIn('customer_invoices.customer_id', customerIDs)
      .where('customer_invoices.account_id', accountID)
      .orderBy('customer_invoices.invoice_date', 'desc')
      .leftJoin('customer_payments', function () {
        this.on('customer_invoices.customer_invoice_id', '=', 'customer_payments.customer_invoice_id').andOn(
          'customer_payments.account_id',
          '=',
          'customer_invoices.account_id'
        );
      })
      .groupBy('customer_invoices.customer_invoice_id', 'customer_payments.payment_id', 'customer_invoices.customer_id');
  },

  getPaymentsForCustomer(db, accountID, customerID, lastInvoiceDate) {
    return db
      .select('customer_payments.*', 'customer_invoices.*')
      .from('customer_payments')
      .leftJoin('customer_invoices', 'customer_payments.customer_invoice_id', '=', 'customer_invoices.customer_invoice_id')
      .where('customer_payments.customer_id', customerID)
      .where('customer_payments.account_id', accountID)
      .groupBy('customer_payments.payment_id', 'customer_invoices.customer_invoice_id')
      .orderBy('customer_payments.payment_date', 'desc');
  },

  getTransactionsForArrayOfCustomers(db, accountID, customerID, lastInvoiceDate) {
    return db
      .select('customer_transactions.*', 'customer_jobs.customer_job_id', 'customer_job_types.job_description')
      .from('customer_transactions')
      .leftJoin('customer_jobs', 'customer_transactions.customer_job_id', 'customer_jobs.customer_job_id')
      .leftJoin('customer_job_types', 'customer_jobs.job_type_id', 'customer_job_types.job_type_id')
      .where('customer_transactions.customer_id', customerID)
      .where('customer_transactions.account_id', accountID)
      .where(builder => {
        if (lastInvoiceDate) {
          builder.where('transaction_date', '>', lastInvoiceDate);
        }
      })
      .orderBy('customer_transactions.transaction_date', 'desc');
  },

  getWriteOffsForArrayOfCustomers(db, accountID, customerID, lastInvoiceDate) {
    return db
      .select(
        'customer_writeoffs.*',
        'customer_invoices.invoice_number',
        'customer_invoices.invoice_date',
        'customer_invoices.total_amount_due',
        'customer_transactions.transaction_id',
        'customer_transactions.transaction_date',
        'customer_transactions.transaction_type',
        'customer_transactions.total_transaction'
      )
      .from('customer_writeoffs')
      .leftJoin('customer_invoices', 'customer_writeoffs.customer_invoice_id', 'customer_invoices.customer_invoice_id')
      .leftJoin('customer_transactions', 'customer_writeoffs.transaction_id', 'customer_transactions.transaction_id')
      .where('customer_writeoffs.customer_id', customerID)
      .where('customer_writeoffs.account_id', accountID)
      .where(builder => {
        if (lastInvoiceDate) {
          builder.where('customer_writeoffs.writeoff_date', '>', lastInvoiceDate);
        }
      })
      .orderBy('customer_writeoffs.writeoff_date', 'desc');
  },

  customersLastInvoiceDate(db, accountID, customerIDs) {
    return db
      .select('c.customer_id', db.raw("COALESCE(MAX(max_inv.invoice_date), '1900-01-01') as invoice_date"))
      .from('customers as c')
      .leftJoin(
        db.raw(`
      (SELECT customer_id, MAX(invoice_date) as invoice_date
      FROM customer_invoices
      WHERE account_id = ${accountID}
      GROUP BY customer_id) as max_inv
    `),
        'c.customer_id',
        'max_inv.customer_id'
      )
      .whereIn('c.customer_id', customerIDs)
      .groupBy('c.customer_id', 'max_inv.invoice_date');
  },

  getLastInvoiceNumberInDB(db, accountID) {
    return db
      .select(db.raw('MAX(invoice_number)'))
      .from('customer_invoices')
      .where('account_id', accountID)
      .first()
      .then(result => {
        // Extract the maximum invoice number from the result object, or return null if no rows are found
        const maxInvoiceNumber = result ? result.max : null;
        // Return just the string value, or null if no rows are found
        return maxInvoiceNumber || new Date();
      });
  },

  getAccountPayToInfo(db, accountID) {
    return db
      .select(
        'accounts.*',
        'account_information.account_street',
        'account_information.account_city',
        'account_information.account_state',
        'account_information.account_zip',
        'account_information.account_email',
        'account_information.account_phone'
      )
      .from('accounts')
      .leftJoin('account_information', function () {
        this.on('accounts.account_id', '=', 'account_information.account_id')
          .andOn('account_information.is_account_mailing_address', db.raw('?', [true]))
          .andOn('account_information.is_this_address_active', db.raw('?', [true]));
      })
      .where('accounts.account_id', accountID)
      .then(rows => rows[0]);
  },

  getRetainersForArrayOfCustomers(db, accountID, customerID) {
    return db
      .select()
      .from('customer_retainers_and_prepayments')
      .where('customer_id', customerID)
      .where('account_id', accountID)
      .where('current_amount', '<', 0)
      .orderBy('created_at', 'desc');
  },

  postNewInvoice(db, invoice) {
    return db
      .insert(invoice)
      .into('customer_invoices')
      .returning('*')
      .then(rows => rows[0]);
  },

  updatePayments(db, record, invoiceReference) {
    return db
      .update({ customer_invoice_id: invoiceReference })
      .into('customer_payments')
      .where('payment_id', record.payment_id)
      .returning('*')
      .then(rows => rows[0]);
  },

  postNewPayment(db, payment) {
    return db
      .insert(payment)
      .into('customer_payments')
      .returning('*')
      .then(rows => rows[0]);
  },

  updateRetainer(db, retainer) {
    const { current_amount, is_retainer_active } = retainer;
    return db
      .update({ current_amount, is_retainer_active })
      .into('customer_retainers_and_prepayments')
      .where('retainer_id', retainer.retainer_id)
      .returning('*')
      .then(rows => rows[0]);
  },

  updateWriteOff(db, record, invoiceReference) {
    return db
      .update({ customer_invoice_id: invoiceReference })
      .into('customer_writeoffs')
      .where('writeoff_id ', record.writeoff_id)
      .returning('*')
      .then(rows => rows[0]);
  },

  updateTransactions(db, transaction, invoiceReference) {
    return db
      .update({ customer_invoice_id: invoiceReference })
      .into('customer_transactions')
      .where('transaction_id', transaction.transaction_id)
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = invoiceService;
