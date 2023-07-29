const archiver = require('archiver');
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

/**
 * Zips the files
 * @param {*} newInvoices
 * @returns
 */
const createZip = newInvoices =>
  new Promise((resolve, reject) => {
    const archive = archiver('zip');
    const output = new stream.PassThrough();

    archive.on('error', err => {
      reject(err);
    });

    archive.pipe(output);

    newInvoices.map(invoice => {
      const { display_name } = invoice.customerContactInfo;
      const pdfStream = new stream.PassThrough();
      pdfStream.end(invoice.pdfBuffer);

      archive.append(pdfStream, { name: `${display_name}.pdf` });
    });

    archive.finalize();

    resolve(output);
  });

/**
 * Save the zip to the fs
 * @param {*} zipStream
 * @param {*} accountID
 * @returns
 */
const saveZipToDisk = (zipStream, accountID) =>
  new Promise((resolve, reject) => {
    const now = dayjs().format();
    const filePath = path.join('invoices', accountID.toString(), `account_${accountID}_${now}.zip`);

    // Create the directory if it doesn't exist
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const fileStream = fs.createWriteStream(filePath);
    zipStream.pipe(fileStream);

    fileStream.on('error', reject);
    fileStream.on('finish', () => {
      resolve(filePath);
    });
  });

module.exports = { createZip, saveZipToDisk };
