const groupAndTotalRetainers = (customer_id, invoiceQueryData, hideRetainers) => {
   const customerRetainerRecords = invoiceQueryData.customerRetainers[customer_id] || [];
   const retainerTotal = customerRetainerRecords ? customerRetainerRecords.reduce((acc, retainerRecord) => acc + Number(retainerRecord.current_amount), 0) : 0;
   return hideRetainers ? { retainerTotal: 0, retainerRecords: [] } : { retainerTotal, retainerRecords: customerRetainerRecords };
};

module.exports = { groupAndTotalRetainers };
