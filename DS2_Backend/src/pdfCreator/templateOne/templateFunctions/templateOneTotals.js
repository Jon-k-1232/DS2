const createTotalsSection = (doc, invoiceDetails, preferenceSettings) => {
   const { retainers, remainingRetainer, invoiceTotal } = invoiceDetails;
   const { normalFont, boldFont, lineHeight, alignRight, endOfGroupingHeight } = preferenceSettings;

   const groupHeight = endOfGroupingHeight + 25;

   //  if (retainers.retainerRecords.length) {
   //     doc.font(normalFont)
   //        .fontSize(12)
   //        .text(`Remaining Retainer/ Pre-Payment: ${remainingRetainer.toFixed(2)}`, alignRight(`Remaining Retainer/ Pre-Payment: ${remainingRetainer.toFixed(2)}`, 1), groupHeight + lineHeight);
   //  }

   doc.font(boldFont)
      .fontSize(14)
      .text(
         `Balance Due: ${invoiceTotal.toFixed(2)}`,
         alignRight(`Balance Due: ${invoiceTotal.toFixed(2)}`, 1),
         //  retainers.retainerRecords.length ? groupHeight + lineHeight * 2 : groupHeight + lineHeight
         groupHeight + lineHeight
      );

   preferenceSettings.endOfGroupingHeight = groupHeight + lineHeight * 2;
};

module.exports = { createTotalsSection };
