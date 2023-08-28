const dayjs = require('dayjs');
const { createPDF } = require('../pdfCreator/templateOne/templateOneOrchestrator');
const { createAndSaveZip } = require('../pdfCreator/zipOrchestrator');
const config = require('../../config');
const fs = require('fs').promises;

/**
 * Create pdf buffer and metadata for each invoice and save pdf to disk
 * @param {*} invoicesWithDetail- Array of objects- each object is an invoice
 * @returns {Object} - { pdfBuffer: [{},{}], fileLocation:'filePath' }
 */
const createAndSavePdfsToDisk = async (invoicesWithDetail, isFinalized, accountBillingInformation) => {
   try {
      const now = dayjs().format('MM-DD-YYYY_T_HH_mm_ss');
      const accountName = accountBillingInformation.account_name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileLocation = isFinalized ? `${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Invoices/Final/${now}` : `${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Invoices/Preview/${now}`;

      await fs.mkdir(fileLocation, { recursive: true });
      const invoiceBuffer = await createBuffer(invoicesWithDetail, fileLocation);

      // Zip the pdfs
      await Promise.all(invoiceBuffer.map(async () => createAndSaveZip(invoiceBuffer, fileLocation)));

      // Location of saved file
      return `${fileLocation}/zipped_files.zip`;
   } catch (error) {
      console.log(`Error creating and saving pdfs to disk: ${error.message}`);
      throw new Error('Error creating and saving pdfs to disk: ' + error.message);
   }
};

/**
 * Creates a PDF buffer and metadata for each invoice
 * @param {*} invoicesWithDetail - Array of objects- each object is an invoice
 * @param {*} isFinalized - Boolean
 * @param {*} now - Date/Time
 */
const createBuffer = async invoicesWithDetail => {
   return Promise.all(
      invoicesWithDetail.map(async invoice => {
         // Loop through invoices and create PDFs
         const pdfBuffer = await createPDF(invoice);

         return {
            pdfBuffer,
            metadata: {
               displayName: invoice.customerContactInformation.display_name
            }
         };
      })
   );
};

module.exports = { createAndSavePdfsToDisk };
