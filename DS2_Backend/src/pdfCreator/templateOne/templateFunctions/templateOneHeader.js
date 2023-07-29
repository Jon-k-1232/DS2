const createPdfHeader = (doc, invoiceDetails, preferenceSettings) => {
  const { incrementedNextInvoiceNumber, accountPayToInfo } = invoiceDetails;
  const { account_name, account_street, account_city, account_state, account_zip, account_phone, account_email } = accountPayToInfo;
  const { boldFont, normalFont, headerHeight, rightMargin, leftMargin, pageWidth, alignRight } = preferenceSettings;
  const emailWidth = doc.widthOfString(account_email);

  doc
    .font(normalFont)
    .fontSize(12)
    .text(`${account_name}`, 75, headerHeight)
    .text(`${account_street}`, 75, headerHeight + 30)
    .text(`${account_city}, ${account_state} ${account_zip}`, 75, headerHeight + 15);

  doc.font(boldFont).fontSize(20).text('INVOICE', alignRight('INVOICE', 0), headerHeight);

  doc
    .font(normalFont)
    .fontSize(12)
    .text(
      `${incrementedNextInvoiceNumber}`,
      alignRight(`${incrementedNextInvoiceNumber}`, 1),
      headerHeight + 25,
      doc.widthOfString('INVOICE')
    )
    .text(
      `Phone: ${account_phone} `,
      alignRight(`Email: ${account_email}`, 1),
      headerHeight + 45,
      emailWidth + doc.widthOfString('Email: ')
    )
    .text(
      `Email: ${account_email}`,
      alignRight(`Email: ${account_email}`, 1),
      headerHeight + 65,
      emailWidth + doc.widthOfString('Email: ')
    );

  doc
    .lineCap('butt')
    .lineWidth(4)
    .moveTo(leftMargin, headerHeight + 95)
    .lineTo(pageWidth - rightMargin, headerHeight + 95)
    .stroke();
};

module.exports = { createPdfHeader };
