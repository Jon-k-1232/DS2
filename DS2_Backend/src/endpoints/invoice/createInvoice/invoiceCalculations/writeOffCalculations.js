const groupAndTotalWriteOffs = (customer_id, invoiceQueryData, showWriteOffs) => {
   const customerWriteOffRecords = invoiceQueryData.customerWriteOffs[customer_id] || [];

   if (!showWriteOffs) return { writeOffTotal: 0, writeOffRecords: [], allWriteOffRecords: customerWriteOffRecords };

   const writeOffTotal = customerWriteOffRecords.reduce((acc, writeOffRecord) => acc + Number(writeOffRecord.writeoff_amount), 0);

   if (isNaN(writeOffTotal)) {
      console.log(`Write Off Total on customerID:${customer_id} is NaN`);
      throw new Error(`Write Off Total on customerID:${customer_id} is NaN`);
   }
   if (writeOffTotal === null || writeOffTotal === undefined) {
      console.log(`Write Off Total on customerID:${customer_id} is null or undefined`);
      throw new Error(`Write Off Total on customerID:${customer_id} is null or undefined`);
   }
   if (typeof writeOffTotal !== 'number') {
      console.log(`Write Off Total on customerID:${customer_id} is not a number`);
      throw new Error(`Write Off Total on customerID:${customer_id} is not a number`);
   }

   return { writeOffTotal, writeOffRecords: customerWriteOffRecords, allWriteOffRecords: customerWriteOffRecords };
};

module.exports = { groupAndTotalWriteOffs };

// Todo - Add condition for if showWriteOffs is false, and if transactions is empty, but there are writeoffs, then override showWriteOffs to true, and show writeOffs.
