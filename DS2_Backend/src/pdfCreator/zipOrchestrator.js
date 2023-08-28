const archiver = require('archiver');
const fs = require('fs');

const createAndSaveZip = async (pdfBuffersWithMetadata, directoryPath) => {
   return new Promise((resolve, reject) => {
      // Create a file to stream archive data to.
      const output = fs.createWriteStream(`${directoryPath}/zipped_files.zip`);
      const archive = archiver('zip', {
         zlib: { level: 9 } // Sets the compression level.
      });

      // Listen for all archive data to be written
      output.on('close', () => resolve());

      // Catch errors
      archive.on('error', err => reject(err));

      // Pipe archive data to the file
      archive.pipe(output);

      // Append PDF files to the archive
      pdfBuffersWithMetadata.forEach(({ pdfBuffer, metadata }) => {
         const fileName = `${metadata.displayName}.pdf`;
         archive.append(pdfBuffer, { name: fileName });
      });

      // Finalize the archive
      archive.finalize();
   });
};

module.exports = { createAndSaveZip };
