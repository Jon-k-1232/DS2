const getTotalRetainerAmount = customerRetainerRecords => {
  const retainerTotal = customerRetainerRecords.reduce((acc, retainerRecord) => acc + Number(retainerRecord.current_amount), 0);
  return { retainerTotal, retainerRecords: customerRetainerRecords };
};

module.exports = { getTotalRetainerAmount };
