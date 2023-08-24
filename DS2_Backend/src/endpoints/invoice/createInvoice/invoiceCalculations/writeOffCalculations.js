const groupAndTotalWriteOffs = (customer_id, invoiceQueryData, showWriteOffs) => {
  if (!showWriteOffs) return { writeOffTotal: 0, writeOffRecords: [] };

  const customerWriteOffRecords = invoiceQueryData.customerWriteOffs[customer_id] || [];
  const writeOffTotal = customerWriteOffRecords.reduce((acc, writeOffRecord) => acc + Number(writeOffRecord.writeoff_amount), 0);

  return { writeOffTotal, writeOffRecords: customerWriteOffRecords };
};

module.exports = { groupAndTotalWriteOffs };

// Todo - Add condition for if showWriteOffs is false, and if transactions is empty, but there are writeoffs, then override showWriteOffs to true, and show writeOffs.
