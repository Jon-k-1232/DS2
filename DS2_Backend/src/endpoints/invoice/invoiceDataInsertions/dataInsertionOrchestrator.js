const { createAndSaveZip } = require('../../../pdfCreator/zipOrchestrator');
const { restoreDataTypesInvoiceOnCreate } = require('../invoiceObjects');
const { restoreDataTypesOnTransactions } = require('../../transactions/transactionsObjects');
const { restoreDataTypesOnWriteOffs } = require('../../writeOffs/writeOffsObjects');
const cleanAndValidateWriteOffObject = require('../invoiceDataInsertions/schemaValidation/writeOffValidation');
const cleanAndValidateInvoiceObject = require('./schemaValidation/invoiceValidation');
const cleanAndValidateTransactionObject = require('./schemaValidation/transactionValidation');
const invoiceService = require('../invoice-service');
const transactionsService = require('../../transactions/transactions-service');
const writeOffsService = require('../../writeOffs/writeOffs-service');
const dayjs = require('dayjs');

const dataInsertionOrchestrator = async (db, invoicesWithDetail, accountBillingInformation, pdfBuffer, userID) => {
   if (!invoicesWithDetail || !accountBillingInformation || !pdfBuffer || !userID) {
      throw new Error('Missing necessary arguments for dataInsertionOrchestrator');
   }

   const pdfFileLocations = await saveInvoiceImagesForDatabase(pdfBuffer, accountBillingInformation).catch(err => {
      throw new Error(`Error in saving invoice images: ${err.message}`);
   });
   const pdfFileLocationsMap = pdfFileLocations.reduce((acc, { customerID, filePath }) => ({ ...acc, [customerID]: filePath }), {});

   // Must create invoices first in order to get the new invoice_id to place on the other inserts.
   const newCustomerInvoices = invoicesWithDetail.map(invoice => newInvoiceObject(invoice, pdfFileLocationsMap, userID));
   const arrayOfAreInvoicesValidated = newCustomerInvoices.map(invoice => cleanAndValidateInvoiceObject(invoice));
   const newInvoicesArray = await Promise.all(arrayOfAreInvoicesValidated.map(invoice => invoiceService.createInvoice(db, invoice)));
   const newInvoicesMap = newInvoicesArray.reduce((acc, { customer_id, customer_invoice_id }) => ({ ...acc, [customer_id]: customer_invoice_id }), {});

   // Create Transaction, Write Off, and Payment objects.
   const validatedBillableItems = updateAndValidateBillableObjects(invoicesWithDetail, newInvoicesMap);
   return insertInvoiceWorkItems(db, validatedBillableItems);
};

module.exports = dataInsertionOrchestrator;

/** Insert data into DB with upserts */
const insertInvoiceWorkItems = async (db, validatedBillableItems) => {
   return Promise.all(
      validatedBillableItems.map(async invoice => {
         const { transactions, writeOffs } = invoice;
         return Promise.all([transactionsService.upsertTransactions(db, transactions), writeOffsService.upsertWriteOffs(db, writeOffs)]).catch(err => {
            throw new Error(`Error in inserting transactions and write offs: ${err.message}`);
         });
      })
   );
};

/**
 * Update data types. Validate data.
 * @param {*} invoicesWithDetail
 * @param {*} newInvoicesMap
 * @returns
 */
const updateAndValidateBillableObjects = (invoicesWithDetail, newInvoicesMap) => {
   return invoicesWithDetail.map(invoice => {
      const { transactions: { allTransactionRecords } = {}, writeOffs: { allWriteOffRecords } = {} } = invoice;

      // Update data types. Validate data.
      const transactions = allTransactionRecords.map(transaction => {
         const newTransactionObject = restoreDataTypesOnTransactions({ ...transaction, customer_invoice_id: newInvoicesMap[transaction.customer_id] });
         return cleanAndValidateTransactionObject(newTransactionObject);
      });

      // Update data types. Validate data.
      const writeOffs = allWriteOffRecords.map(writeOff => {
         const newWriteOffObject = restoreDataTypesOnWriteOffs({ ...writeOff, customer_invoice_id: newInvoicesMap[writeOff.customer_id] });
         return cleanAndValidateWriteOffObject(newWriteOffObject);
      });

      return { transactions, writeOffs };
   });
};

/**
 * Save pdf files to disk for db lookup.
 * Loop through pdfBuffer and create map of customerID as key and pdf file location as value. Convert from buffer to pdf and save on disk as zip.
 * @param {*} pdfBuffer
 * @param {*} accountBillingInformation
 * @returns
 */
const saveInvoiceImagesForDatabase = async (pdfBuffer, accountBillingInformation) => {
   return Promise.all(
      pdfBuffer.map(async pdf => {
         const {
            metadata: { customerID, displayName }
         } = pdf;
         const filePath = await createAndSaveZip([pdf], accountBillingInformation, 'program_files/invoice_images', `${displayName}.zip`);

         return { customerID, filePath };
      })
   );
};

/**
 * Creates new invoice object to be inserted into the database
 */
const newInvoiceObject = (invoice, pdfFileLocationsMap, userID) => {
   const {
      customer_id,
      lastInvoiceDate,
      invoiceNumber,
      dueDate,
      invoiceTotal,
      customerContactInformation: { customer_info_id, account_id } = {},
      outstandingInvoices: { outstandingInvoiceTotal } = {},
      payments: { paymentTotal } = {},
      retainers: { retainerTotal } = {},
      transactions: { transactionsTotal } = {},
      writeOffs: { writeOffTotal } = {}
   } = invoice;

   return restoreDataTypesInvoiceOnCreate({
      account_id,
      customer_id,
      customer_info_id,
      invoice_number: invoiceNumber,
      due_date: dayjs(dueDate).format(),
      beginning_balance: outstandingInvoiceTotal || 0,
      total_payments: paymentTotal || 0,
      total_charges: transactionsTotal || 0,
      total_write_offs: writeOffTotal || 0,
      total_retainers: retainerTotal || 0,
      total_amount_due: invoiceTotal || 0,
      remaining_balance_on_invoice: invoiceTotal,
      parent_invoice_id: null,
      invoice_date: dayjs().format(),
      is_invoice_paid_in_full: false,
      fully_paid_date: null,
      created_by_user_id: userID,
      start_date: dayjs(lastInvoiceDate).format(),
      end_date: dayjs().format(),
      invoice_file_location: pdfFileLocationsMap[customer_id],
      notes: null
   });
};
