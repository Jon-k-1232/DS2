const restoreDataTypesJobCategoriesOnCreate = data => ({
  account_id: Number(data.accountID),
  customer_job_category: data.category,
  is_job_category_active: Boolean(data.isActive),
  created_by_user_id: Number(data.createdBy)
});

const restoreDataTypesJobCategoriesOnUpdate = data => ({
  customer_job_category_id: Number(data.customer_job_category_id),
  account_id: Number(data.account_id),
  customer_job_category: data.customer_job_category,
  is_job_category_active: Boolean(data.is_job_category_active),
  created_by_user_id: Number(data.created_by_user_id)
});

module.exports = {
  restoreDataTypesJobCategoriesOnCreate,
  restoreDataTypesJobCategoriesOnUpdate
};
