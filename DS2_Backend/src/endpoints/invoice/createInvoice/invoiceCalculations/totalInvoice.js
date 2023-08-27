const totalInvoice = (invoiceInformation, showWriteOffs, hideRetainers) => {
   const { payments, retainers, writeOffs, transactions, outstandingInvoices } = invoiceInformation;

   const invoiceTotalHidingWriteOffs = payments.paymentTotal + transactions.transactionsTotal + outstandingInvoices.outstandingInvoiceTotal;

   const writeOffsTotal = showWriteOffs ? writeOffs.writeOffTotal : 0;
   const retainerTotal = hideRetainers ? 0 : retainers.retainerTotal;

   return invoiceTotalHidingWriteOffs + writeOffsTotal + retainerTotal;
};

module.exports = { totalInvoice };
