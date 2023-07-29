/**
 * Customer payments and payments total
 * @param {*} customerPayments
 * @returns
 */
const groupAndTotalPayments = customerPayments => {
  const paymentTotal = customerPayments.reduce((acc, payment) => acc + Number(payment.payment_amount), 0);
  return { paymentTotal, paymentRecords: customerPayments };
};

module.exports = { groupAndTotalPayments };
