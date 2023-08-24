const groupAndTotalOutstandingInvoices = (customer_id, invoiceQueryData) => {
   const customerOutstandingInvoices = invoiceQueryData.customerOutstandingInvoices[customer_id] || [];
   const customerPayments = invoiceQueryData.customerPayments[customer_id] || [];

   let outstandingInvoiceTotal = 0;

   // Create a map of payments by customer_invoice_id
   const paymentsMap = customerPayments.reduce((prev, payment) => {
      prev[payment.customer_invoice_id] = prev[payment.customer_invoice_id] || [];
      prev[payment.customer_invoice_id].push(payment);
      return prev;
   }, {});

   // For each invoice line, we need to know the amount before payments, and the amount after payments.
   const updatedInvoiceRecords = customerOutstandingInvoices.map(invoice => {
      const invoicePayments = paymentsMap[invoice.customer_invoice_id] || [];
      const calculatedTotalPayments = invoicePayments.reduce((total, payment) => total + Number(payment.payment_amount), 0);
      const calculatedBeginningBalance = Number(invoice.remaining_balance_on_invoice) - calculatedTotalPayments;

      // Calculate the total of all outstanding invoices
      outstandingInvoiceTotal += calculatedBeginningBalance;

      return {
         ...invoice,
         calculations: {
            calculatedBeginningBalance,
            calculatedTotalPayments
         },
         paymentRecords: invoicePayments
      };
   });

   return {
      outstandingInvoiceRecord: [...customerOutstandingInvoices],
      outstandingInvoiceTotal,
      updatedInvoiceRecords
   };
};

module.exports = { groupAndTotalOutstandingInvoices };
