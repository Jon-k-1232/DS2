const createNotesSection = (doc, invoiceDetails, preferenceSettings) => {
  const { invoiceNote, accountPayToInfo } = invoiceDetails;
  const { account_statement, account_interest_statement } = accountPayToInfo;
  const { normalFont, boldFont, lineHeight, leftMargin, pageWidth, bottomMargin, pageHeight, endOfGroupingHeight } = preferenceSettings;

  const groupHeight = endOfGroupingHeight + 25;

  doc
    .font(normalFont)
    .fontSize(12)
    .text(account_statement, leftMargin + 10, groupHeight);

  if (invoiceNote) {
    doc
      .font(boldFont)
      .fontSize(12)
      .text('Notes', leftMargin + 10, groupHeight + lineHeight * 2);

    doc
      .font(normalFont)
      .fontSize(12)
      .text(invoiceNote, leftMargin + 10, groupHeight + lineHeight * 3);
  }

  doc
    .font(normalFont)
    .fontSize(8)
    .text(
      account_interest_statement,
      pageWidth / 2 - doc.widthOfString(account_interest_statement) / 2,
      pageHeight - bottomMargin - lineHeight
    );
};

module.exports = { createNotesSection };
