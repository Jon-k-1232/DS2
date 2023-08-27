const dayjs = require('dayjs');
const { createPDF } = require('../pdfCreator/templateOne/templateOneOrchestrator');
const config = require('../../config');
const fs = require('fs').promises;

/**
 * Create pdf buffer and metadata for each invoice and save pdf to disk
 * @param {*} invoicesWithDetail- Array of objects- each object is an invoice
 * @returns {Object} - { pdfBuffer: [{},{}], fileLocation:'filePath' }
 */
const createAndSavePdfsToDisk = async (invoicesWithDetail, isFinalized) => {
   const now = dayjs().format('MM-DD-YYYY_T_HH_mm_ss');

   const invoiceBuffer = await createBuffer(invoicesWithDetail, isFinalized, now);
   const [fileLocation] = await savePdfsToDisk(invoiceBuffer, isFinalized, now);

   return { pdfBuffer: invoiceBuffer, ...fileLocation };
};

/**
 * Creates a PDF buffer and metadata for each invoice
 * @param {*} invoicesWithDetail - Array of objects- each object is an invoice
 * @param {*} isFinalized - Boolean
 * @param {*} now - Date/Time
 */
const createBuffer = async (invoicesWithDetail, isFinalized, now) => {
   // Create PDF buffer and metadata for each invoice
   return Promise.all(
      invoicesWithDetail.map(async invoice => {
         const accountName = invoice.accountBillingInformation.account_name;

         if (isFinalized) {
            // Create directory if it doesn't exist
            await fs.mkdir(`${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Final/${now}`, { recursive: true });
         } else {
            await fs.mkdir(`${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Preview/${now}`, { recursive: true });
         }

         // Loop through invoices and create PDFs
         const pdfBuffer = await createPDF(invoice);

         return {
            pdfBuffer,
            metadata: {
               accountName,
               displayName: invoice.customerContactInformation.display_name
            }
         };
      })
   );
};

/**
 * Saves Pdfs to disk
 * @param {*} invoiceBuffer - Array of objects- each object is an invoice
 * @param {*} isFinalized - Boolean
 * @param {*} now - Date/Time
 */
const savePdfsToDisk = async (invoiceBuffer, isFinalized, now) => {
   // Save PDFs to disk
   return Promise.all(
      invoiceBuffer.map(async ({ pdfBuffer, metadata }) => {
         const fileName = `${metadata.displayName}.pdf`;
         const accountName = metadata.accountName;

         if (isFinalized) {
            await fs.writeFile(`${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Final/${now}/${fileName}`, pdfBuffer);
            return { file_location: `${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Final/${now}` };
         }

         await fs.writeFile(`${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Preview/${now}/${fileName}`, pdfBuffer);
         return { file_location: `${config.DEFAULT_PDF_SAVE_LOCATION}/${accountName}/Preview/${now}` };
      })
   );
};

module.exports = { createAndSavePdfsToDisk };
