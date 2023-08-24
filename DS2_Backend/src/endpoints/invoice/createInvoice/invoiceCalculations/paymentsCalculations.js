/**
 * Customer payments and payments total
 * @param {*} customerPayments
 * @returns
 */
const groupAndTotalPayments = (customer_id, invoiceQueryData) => {
  const customerPayments = invoiceQueryData.customerPayments[customer_id] || [];
  const paymentTotal = customerPayments ? customerPayments.reduce((acc, payment) => acc + Number(payment.payment_amount), 0) : 0;
  return { paymentTotal, paymentRecords: customerPayments };
};

module.exports = { groupAndTotalPayments };
