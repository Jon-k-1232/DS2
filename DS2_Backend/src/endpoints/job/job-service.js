const jobService = {
   createJob(db, newJob) {
      return db
         .insert(newJob)
         .into('customer_jobs')
         .returning('*')
         .then(rows => rows[0]);
   },

   getSingleJob(db, customerJobID) {
      return db.select().from('customer_jobs').where('customer_job_id', customerJobID);
   },

   getSingleJobType(db, jobTypeID, accountID) {
      return db.select().from('customer_jobs').where('job_type_id', jobTypeID).andWhere('account_id', accountID);
   },

   getActiveJobs(db, accountID) {
      return db
         .select()
         .from('customer_jobs')
         .join('customer_job_types', 'customer_jobs.job_type_id', 'customer_job_types.job_type_id')
         .where('customer_jobs.account_id', accountID)
         .andWhere('customer_job_types.account_id', accountID);
   },

   // !! Must be in asc order, oldest to newest.
   getActiveCustomerJobs(db, accountID, customerID) {
      return db
         .select()
         .from('customer_jobs')
         .where('customer_jobs.account_id', accountID)
         .andWhere('customer_jobs.customer_id', customerID)
         .join('customer_job_types', 'customer_jobs.job_type_id', 'customer_job_types.job_type_id')
         .join('customer_job_categories', 'customer_job_types.customer_job_category_id', 'customer_job_categories.customer_job_category_id')
         .orderBy('customer_jobs.created_at', 'asc');
   },

   updateJob(db, updatedJob) {
      return db.update(updatedJob).into('customer_jobs').where('customer_job_id', '=', updatedJob.customer_job_id);
   },

   deleteJob(db, jobID) {
      return db.transaction(async trx => {
         await trx('customer_transactions').where('customer_job_id', jobID).del();

         return trx('customer_jobs').where('customer_job_id', jobID).del();
      });
   },

   /**
    * !! Must be in desc order, newest to oldest. to select most recent job.
    * Does not include the customer_job_id, and created_at fields, used for updating/creating a new job record.
    * @param {*} db
    * @param {*} jobId
    * @returns
    */
   getRecentJob(db, jobId) {
      return db
         .select(
            'parent_job_id',
            'account_id',
            'customer_id',
            'job_type_id',
            'job_quote_amount',
            'agreed_job_amount',
            'current_job_total',
            'job_status',
            'is_job_complete',
            'is_quote',
            'created_by_user_id',
            'notes'
         )
         .from('customer_jobs')
         .where('customer_job_id', jobId)
         .orderBy('created_at', 'desc')
         .limit(1)
         .first();
   }
};

module.exports = jobService;
