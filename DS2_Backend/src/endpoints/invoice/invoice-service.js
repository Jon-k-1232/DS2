const invoiceService = {
   // Must stay desc, used in finding if an invoice has to be created
   getInvoices(db, accountID) {
      return db.select('*').from('customer_invoices').where('account_id', accountID).orderBy('invoice_date', 'desc');
   },

   getCustomerInvoiceByID(db, accountID, customerID) {
      return db.select('*').from('customer_invoices').where('account_id', accountID).andWhere('customer_id', customerID).orderBy('invoice_date', 'asc');
   },

   getInvoiceByInvoiceRowID(db, accountID, invoiceRowID) {
      return db.select('*').from('customer_invoices').where('account_id', accountID).andWhere('customer_invoice_id', invoiceRowID);
   },

   getLastInvoiceNumber(db, accountID) {
      return db.select('invoice_number').from('customer_invoices').where('account_id', accountID).orderBy('invoice_date', 'desc').first();
   },

   createInvoice(db, invoice) {
      return db
         .insert(invoice)
         .into('customer_invoices')
         .returning('*')
         .then(rows => rows[0]);
   },

   // Returns an object vs array.
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

   async getLastInvoiceDatesByCustomerID(db, accountID, customerIDs) {
      const data = await db
         .select('customer_id')
         .max('invoice_date as last_invoice_date')
         .from('customer_invoices')
         .where('account_id', accountID)
         .whereIn('customer_id', customerIDs)
         .andWhere(function () {
            this.whereNull('parent_invoice_id').orWhereRaw('parent_invoice_id = customer_invoice_id');
         })
         .groupBy('customer_id')
         .orderBy('last_invoice_date', 'desc');

      return data.reduce((result, { customer_id, last_invoice_date }) => ({ ...result, [customer_id]: last_invoice_date }), {});
   },

   getCustomerInvoicesByCustomerID(db, customerIDs, accountID) {
      return db
         .select('*')
         .from('customer_invoices')
         .where('account_id', accountID)
         .whereIn('customer_id', customerIDs)
         .andWhere('is_invoice_paid_in_full', false)
         .andWhere('remaining_balance_on_invoice', '>', 0)
         .orderBy('created_at', 'desc');
   },

   async getCustomerInformation(db, accountID, customerIDs) {
      const data = await db
         .from('customers')
         .join('customer_information', 'customers.customer_id', '=', 'customer_information.customer_id')
         .select('customers.*', 'customer_information.*')
         .whereIn('customers.customer_id', customerIDs)
         .where({
            'customers.account_id': accountID,
            'customer_information.is_customer_mailing_address': true,
            'customer_information.is_this_address_active': true,
            'customer_information.account_id': accountID
         });

      return data.reduce((result, { customer_id, ...info }) => ({ ...result, [customer_id]: info }), {});
   },

   // Based off the last date, finds all transactions
   async getTransactionsByCustomerID(db, accountID, customerIDs, lastBillDateLookup) {
      const data = await db('customer_transactions')
         .join('customer_jobs', 'customer_jobs.customer_job_id', '=', 'customer_transactions.customer_job_id')
         .join('customer_job_types', 'customer_job_types.job_type_id', '=', 'customer_jobs.job_type_id')
         .select('customer_transactions.*', 'customer_jobs.*', 'customer_job_types.*')
         .where({
            'customer_transactions.account_id': accountID
         })
         .andWhere(builder => {
            customerIDs.forEach(id => {
               // Handles query if there is a id in the lastBillDateLookup
               if (lastBillDateLookup[id]) {
                  builder.orWhere(subQuery => {
                     subQuery.where('customer_transactions.customer_id', id).andWhere('customer_transactions.transaction_date', '>', lastBillDateLookup[id]);
                  });
                  // Handles query if there is no id in the lastBillDateLookup
               } else {
                  builder.orWhere('customer_transactions.customer_id', id);
               }
            });
         });

      return data.reduce((result, transaction) => {
         const { customer_id } = transaction;
         if (!result[customer_id]) result[customer_id] = [];
         result[customer_id].push(transaction);
         return result;
      }, {});
   },

   async getPaymentsByCustomerID(db, accountID, customerIDs, lastBillDateLookup) {
      const data = await db('customer_payments')
         .select('customer_payments.*')
         .where({
            'customer_payments.account_id': accountID
         })
         .andWhere(builder => {
            customerIDs.forEach(id => {
               // Handles query if there is an ID in the lastBillDateLookup
               if (lastBillDateLookup[id]) {
                  builder.orWhere(subQuery => {
                     subQuery.where('customer_payments.customer_id', id).andWhere('customer_payments.payment_date', '>', lastBillDateLookup[id]);
                  });
                  // Handles query if there is no ID in the lastBillDateLookup
               } else {
                  builder.orWhere('customer_payments.customer_id', id);
               }
            });
         });

      return data.reduce((result, payment) => {
         const { customer_id } = payment;
         if (!result[customer_id]) result[customer_id] = [];
         result[customer_id].push(payment);
         return result;
      }, {});
   },

   async getWriteOffsByCustomerID(db, accountID, customerIDs, lastBillDateLookup) {
      const data = await db('customer_writeoffs')
         .join('customer_jobs', 'customer_jobs.customer_job_id', '=', 'customer_writeoffs.customer_job_id')
         .join('customer_job_types', 'customer_job_types.job_type_id', '=', 'customer_jobs.job_type_id')
         .select('customer_writeoffs.*', 'customer_jobs.job_type_id', 'customer_job_types.job_description')
         .where({
            'customer_writeoffs.account_id': accountID
         })
         .andWhere(builder => {
            customerIDs.forEach(id => {
               // Handles query if there is a id in the lastBillDateLookup
               if (lastBillDateLookup[id]) {
                  builder.orWhere(subQuery => {
                     subQuery.where('customer_writeoffs.customer_id', id).andWhere('customer_writeoffs.writeoff_date', '>', lastBillDateLookup[id]);
                  });
                  // Handles query if there is no id in the lastBillDateLookup
               } else {
                  builder.orWhere('customer_writeoffs.customer_id', id);
               }
            });
         });

      return data.reduce((result, writeoff) => {
         const { customer_id } = writeoff;
         if (!result[customer_id]) result[customer_id] = [];
         result[customer_id].push(writeoff);
         return result;
      }, {});
   },

   async getRetainersByCustomerID(db, accountID, customerIDs, lastBillDateLookup) {
      const data = await db('customer_retainers_and_prepayments')
         .select('customer_retainers_and_prepayments.*')
         .where('customer_retainers_and_prepayments.account_id', accountID)
         .andWhere(builder => {
            customerIDs.forEach(id => {
               if (lastBillDateLookup[id]) {
                  builder.orWhere(subQuery => {
                     subQuery.where('customer_retainers_and_prepayments.customer_id', id).andWhere('customer_retainers_and_prepayments.created_at', '>', lastBillDateLookup[id]);
                  });
               } else {
                  builder.orWhere('customer_retainers_and_prepayments.customer_id', id);
               }
            });
         });

      return data.reduce((result, retainer) => {
         const { customer_id } = retainer;
         if (!result[customer_id]) result[customer_id] = [];
         result[customer_id].push(retainer);
         return result;
      }, {});
   },

   async getOutstandingInvoices(db, accountID, customerIDs, lastBillDateLookup) {
      const outstandingInvoices = {};

      // Fetch all parent invoices
      const parentInvoices = await db
         .select('*')
         .from('customer_invoices')
         .where('account_id', accountID)
         .whereIn('customer_id', customerIDs)
         .andWhere('is_invoice_paid_in_full', false)
         .andWhere('parent_invoice_id', null)
         .andWhere('remaining_balance_on_invoice', '>', 0)
         .orderBy('created_at', 'desc');

      const getLatestInvoice = async parentInvoice => {
         // Find the parent invoice by parent_invoice_id === null
         const latestChildInvoice = await db.select('*').from('customer_invoices').where('parent_invoice_id', parentInvoice.customer_invoice_id).orderBy('created_at', 'desc').first();

         return latestChildInvoice || parentInvoice;
      };

      const latestInvoices = await Promise.all(parentInvoices.map(getLatestInvoice));

      latestInvoices.forEach(invoice => {
         const lastBillDate = lastBillDateLookup[invoice.customer_id];
         const isAfterLastBillDate = lastBillDate && new Date(invoice.created_at) > new Date(lastBillDate);

         if (invoice.remaining_balance_on_invoice > 0 || (invoice.remaining_balance_on_invoice === 0 && isAfterLastBillDate)) {
            if (!outstandingInvoices[invoice.customer_id]) {
               outstandingInvoices[invoice.customer_id] = [];
            }
            // if the invoice is 0, but record created after last invoice date, return the invoice, also if remaining is greater than zero.
            outstandingInvoices[invoice.customer_id].push(invoice);
         }
      });

      return outstandingInvoices;
   }
};

module.exports = invoiceService;
