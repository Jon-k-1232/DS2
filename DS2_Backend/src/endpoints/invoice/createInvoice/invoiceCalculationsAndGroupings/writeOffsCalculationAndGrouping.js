const getTotalWriteoffAmount = writeoffArray => {
  const result = writeoffArray.reduce(
    (accumulator, writeoff) => {
      accumulator.totalWriteOffs += writeoff.writeoff_amount ? parseFloat(writeoff.writeoff_amount) : 0;
      accumulator.writeOffs.push(writeoff);
      return accumulator;
    },
    { totalWriteOffs: 0, writeOffs: [] }
  );

  return result;
};

module.exports = { getTotalWriteoffAmount };
