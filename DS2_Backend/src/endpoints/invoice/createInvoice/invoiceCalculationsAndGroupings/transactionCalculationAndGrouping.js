const groupAndTotalTransactions = data => {
  return data.reduce(
    (result, item) => {
      let { customer_job_id: jobId, total_transaction, job_description } = item;
      let transactionTotal = parseFloat(total_transaction);

      // Add the transaction total to the overall total
      result.transactionTotals += transactionTotal;

      if (!result.jobs[jobId]) {
        // If the job is not in the result object, initialize it
        result.jobs[jobId] = {
          jobTotal: 0,
          customer_job_id: jobId,
          jobDescription: job_description,
          transactions: []
        };
      }

      // Add the transaction total to the job total and push the transaction
      result.jobs[jobId].jobTotal += transactionTotal;
      result.jobs[jobId].transactions.push(item);

      return result;
    },
    {
      transactionTotals: 0,
      jobs: {}
    }
  );
};

module.exports = { groupAndTotalTransactions };
