const dayjs = require('dayjs');

const createOutstandingChargesSection = (doc, invoiceDetails, preferenceSettings) => {
  const { outstandingInvoices } = invoiceDetails;
  const { boldFont, normalFont, bodyHeight, lineHeight, rightMargin, leftMargin, pageWidth, alignRight, endOfGroupingHeight } =
    preferenceSettings;

  const groupHeight = endOfGroupingHeight + bodyHeight;

  doc.font(boldFont).fontSize(14).text('Beginning Balance', leftMargin, groupHeight);

  doc
    .font(normalFont)
    .fontSize(12)
    .text('Invoice Date', leftMargin + 10, groupHeight + lineHeight)
    .text('Invoice', 200, groupHeight + lineHeight)
    .text('Original Amount', 400, groupHeight + lineHeight)
    .text('Outstanding', alignRight('Outstanding', 0), groupHeight + lineHeight);

  doc
    .lineCap('butt')
    .lineWidth(1)
    .moveTo(leftMargin, groupHeight + lineHeight * 2)
    .lineTo(pageWidth - rightMargin, groupHeight + lineHeight * 2)
    .stroke();

  const loopHeight = groupHeight + lineHeight * 2 + 10;

  Object.values(outstandingInvoices?.invoiceRecords ?? {}).forEach((outstandingRecord, index) => {
    const yHeight = loopHeight + lineHeight * index;

    doc
      .font(normalFont)
      .fontSize(12)
      .text(`${dayjs(outstandingRecord.invoiceDate).format('MM/DD/YYYY')}`, leftMargin + 10, yHeight)
      .text(`${outstandingRecord.invoiceNumber}`, 200, yHeight)
      .text(`${outstandingRecord.invoiceBeginningBalance.toFixed(2)}`, 400, yHeight)
      .text(
        `${outstandingRecord.invoiceBalanceDisplay.toFixed(2)}`,
        alignRight(`${outstandingRecord.invoiceBalanceDisplay.toFixed(2)}`, 1),
        yHeight
      );

    // if last index draw line
    if (index === Object.values(outstandingInvoices?.invoiceRecords ?? {}).length - 1) {
      doc
        .lineCap('butt')
        .lineWidth(1)
        .moveTo(leftMargin, yHeight + lineHeight)
        .lineTo(pageWidth - rightMargin, yHeight + lineHeight)
        .stroke();

      doc
        .font(normalFont)
        .fontSize(12)
        .text(
          `Beginning Balance: ${outstandingInvoices.outstandingBalanceTotalForInvoiceDisplay.toFixed(2)}`,
          alignRight(`Beginning Balance:  ${outstandingInvoices.outstandingBalanceTotalForInvoiceDisplay.toFixed(2)}`, -3),
          yHeight + lineHeight * 1.5
        );

      preferenceSettings.endOfGroupingHeight = yHeight + lineHeight * 1.5;
    }
  });

  // if no outstanding invoices
  if (!Object.values(outstandingInvoices?.invoiceRecords ?? {}).length) {
    doc
      .lineCap('butt')
      .lineWidth(1)
      .moveTo(leftMargin, loopHeight + 10)
      .lineTo(pageWidth - rightMargin, loopHeight + 10)
      .stroke();

    doc
      .font(normalFont)
      .fontSize(12)
      .text('Beginning Balance: 0.00', alignRight('Beginning Balance: 0.00', 0), loopHeight + lineHeight);

    preferenceSettings.endOfGroupingHeight = loopHeight + lineHeight;
  }
};

module.exports = { createOutstandingChargesSection };
