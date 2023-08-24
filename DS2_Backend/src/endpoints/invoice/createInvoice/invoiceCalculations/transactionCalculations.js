const groupAndTotalTransactions = (customer_id, invoiceQueryData, showWriteOffs) => {
   const customerTransactions = invoiceQueryData.customerTransactions[customer_id] || [];
   const customerWriteOffRecords = invoiceQueryData.customerWriteOffs[customer_id] || [];

   // Handles if showWriteoff is false than add to transactions, if showWriteOffs is true, then write offs are handles separately.
   const groupedWriteOffs = groupWriteOffsByJob(customerWriteOffRecords, showWriteOffs);
   const transactionsGroupedByJob = groupAndTotalTransactionsByJob(customerTransactions, groupedWriteOffs);
   return totalGroupedJobsByCustomer(transactionsGroupedByJob);
};

// Note: if transactions is empty, but writeoffs exists..... condition to be handled in write offs calculation
// Todo - as written, for write offs to work, the written off job has to be on the current invoice, and be greater than the written off amount. Needs testing.

module.exports = { groupAndTotalTransactions };

/**
 * Group writeoffs by job so to create an object map
 * @param {*} customerWriteOffRecords
 * @returns
 */
const groupWriteOffsByJob = (customerWriteOffRecords, showWriteOffs) => {
   if (!customerWriteOffRecords.length || showWriteOffs) return {};
   return customerWriteOffRecords.reduce((acc, curr) => ({ ...acc, [curr.customer_job_id]: [...(acc[curr.customer_job_id] || []), curr] }), {});
};

/**
 *
 * @param {*} customerTransactions - Array of transactions
 * @param {*} groupedWriteOffs - Object map of writeoffs grouped by job
 */
const groupAndTotalTransactionsByJob = (customerTransactions, groupedWriteOffs) => {
   return customerTransactions.reduce((prev, transaction) => {
      const jobDescription = transaction.job_description;
      const currentJobKey = transaction.customer_job_id;
      const customerID = transaction.customer_id;

      // On job initialization, add the writeoffs to the job
      if (!prev[currentJobKey]) {
         const jobWriteOffRecords = groupedWriteOffs[currentJobKey] || [];
         const jobWriteOffTotal = jobWriteOffRecords.length ? jobWriteOffRecords.reduce((acc, curr) => acc + Number(curr.writeoff_amount), 0) : 0;
         prev[currentJobKey] = { jobDescription, customerID, jobID: currentJobKey, jobTotal: 0 + jobWriteOffTotal, jobWriteOffTotal, jobWriteOffRecords, transactionRecords: [] };
      }

      if (transaction.is_transaction_billable) {
         prev[currentJobKey].jobTotal += Number(transaction.total_transaction);
      }

      prev[currentJobKey].transactionRecords.push(transaction);

      return prev;
   }, {});
};

/**
 * Total all transactions per job and return an object with the total and the transaction records
 * @param {*} transactionsGroupedByJob
 * @returns {Object} { transactionsTotal: Number, transactionRecords: Array }
 */
const totalGroupedJobsByCustomer = transactionsGroupedByJob => {
   if (!Object.values(transactionsGroupedByJob).length) return { transactionsTotal: 0, transactionRecords: [] };

   return Object.values(transactionsGroupedByJob).reduce((acc, curr) => {
      if (!acc.transactionRecords) acc = { transactionsTotal: 0, transactionRecords: [] };

      acc.transactionRecords.push(curr);
      acc.transactionsTotal += curr.jobTotal;

      return acc;
   }, {});
};
