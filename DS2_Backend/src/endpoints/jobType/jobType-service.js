const jobTypeService = {
  createJobType(db, newJobType) {
    return db
      .insert(newJobType)
      .into('customer_job_types')
      .returning('*')
      .then(rows => rows[0]);
  },

  getSingleJobType(db, jobTypeID, account) {
    return db.select().from('customer_job_types').where('job_type_id', jobTypeID).andWhere('account_id', account);
  },

  getActiveJobTypes(db, accountID) {
    return db.select().from('customer_job_types').where('account_id', accountID);
  },

  updateJobType(db, updatedJobType) {
    return db
      .update(updatedJobType)
      .into('customer_job_types')
      .where('job_type_id', '=', updatedJobType.job_type_id)
      .returning('*')
      .then(rows => rows[0]);
  },

  deleteJobType(db, jobTypeID) {
    return db.del().from('customer_job_types').where('job_type_id', '=', jobTypeID);
  }
};

module.exports = jobTypeService;
