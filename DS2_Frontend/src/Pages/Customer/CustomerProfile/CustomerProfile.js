import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function CustomerProfile({ profileData }) {
  const {
    business_name,
    customer_city,
    customer_email,
    customer_id,
    customer_name,
    customer_phone,
    customer_state,
    customer_street,
    customer_zip,
    is_billable,
    is_commercial_customer,
    is_customer_active,
    is_recurring,
    is_this_address_active,
    bill_on_date,
    subscription_frequency,
    start_date,
    end_date,
    recurring_bill_amount
  } = profileData?.customerData?.customerData[0] ?? {};

  const { total_amount_due, invoice_date, due_date } = profileData?.customerInvoiceData?.customerInvoiceData[0] ?? {};
  const retainerArray = profileData?.customerRetainerData?.customerRetainerData ?? [];

  const currentRetainerAmount = retainerArray.reduce(
    (prev, curr) => (curr.type_of_hold === 'Retainer' ? prev + Number(curr.current_amount) : prev),
    0
  );
  const currentPrePaidAmount = retainerArray.reduce(
    (prev, curr) => (curr.type_of_hold === 'Prepayment' ? prev + Number(curr.current_amount) : prev),
    0
  );

  return (
    <Stack style={styles.component}>
      <Stack style={styles.header} direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
        <Typography variant='h3'>{business_name || customer_name}</Typography>
        <Typography variant='h5'>{is_customer_active ? 'Active' : 'Inactive'}</Typography>
        <Typography variant='h5'>Customer Type: {is_commercial_customer ? 'Commercial' : 'Individual'}</Typography>
        <Typography variant='h5'>Client: {customer_id}</Typography>
      </Stack>

      <Stack style={styles.tableContainer}>
        <table style={styles.tableWrapper}>
          <tbody>
            <tr>
              <th style={styles.thStyle}>Company Name:</th>
              <td style={styles.tdStyle}>{business_name || customer_name}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Name:</th>
              <td style={styles.tdStyle}>{customer_name}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Billing Address:</th>
              <td style={styles.tdStyle}>
                {customer_street} {customer_city}, {customer_state} {customer_zip}
              </td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Is Billing Address Active:</th>
              <td style={styles.tdStyle}>{is_this_address_active ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Mailing Address:</th>
              <td style={styles.tdStyle}>
                {customer_street} {customer_city}, {customer_state} {customer_zip}
              </td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Is Mailing Address Active:</th>
              <td style={styles.tdStyle}>{is_this_address_active ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Cell:</th>
              <td style={styles.tdStyle}>{customer_phone}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Email:</th>
              <td style={styles.tdStyle}>{customer_email}</td>
            </tr>
          </tbody>
        </table>

        <table style={styles.tableWrapper}>
          <tbody>
            <tr>
              <th style={styles.thStyle}>Billable:</th>
              <td style={styles.tdStyle}>{is_billable ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Last Billed:</th>
              <td style={styles.tdStyle}>{dayjs(invoice_date).format('MMMM DD, YYYY')}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Invoice Due Date:</th>
              <td style={styles.tdStyle}>{dayjs(due_date).format('MMMM DD, YYYY')}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Last Statement Balance:</th>
              <td style={styles.tdStyle}>{total_amount_due}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Current Retainer:</th>
              <td style={styles.tdStyle}>{currentRetainerAmount}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Current PrePayment:</th>
              <td style={styles.tdStyle}>{currentPrePaidAmount}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Current Balance Due:</th>
              <td style={styles.tdStyle}>{is_this_address_active}</td>
            </tr>
          </tbody>
        </table>
        <table style={styles.tableWrapper}>
          <tbody>
            <tr>
              <th style={styles.thStyle}>Recurring Customer:</th>
              <td style={styles.tdStyle}>{is_recurring ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Frequency:</th>
              <td style={styles.tdStyle}>{is_recurring ? `${subscription_frequency}` : 'N/A'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Billing Day:</th>
              <td style={styles.tdStyle}>{is_recurring ? `${bill_on_date}` : 'N/A'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Recurring Bill Amount:</th>
              <td style={styles.tdStyle}>{is_recurring ? `${recurring_bill_amount}` : 'N/A'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Recurring Start Date:</th>
              <td style={styles.tdStyle}>{start_date ? dayjs(start_date).format('MMMM DD, YYYY') : 'N/A'}</td>
            </tr>
            <tr>
              <th style={styles.thStyle}>Recurring End Date:</th>
              <td style={styles.tdStyle}>{end_date ? dayjs(end_date).format('MMMM DD, YYYY') : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </Stack>
      <Divider style={styles.divider} />
    </Stack>
  );
}

const styles = {
  component: {
    paddingBottom: '20px'
  },
  header: {
    padding: '6px 0px'
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spaceAround',
    alignSelf: 'flexStart'
  },
  thStyle: {
    textAlign: 'left',
    width: '180px'
  },
  tdStyle: {
    textAlign: 'left',
    width: '320',
    paddingRight: '20px'
  },
  tableWrapper: {
    fontSize: '0.875rem',
    height: 'min-Content'
  },
  divider: {
    marginTop: '20px'
  }
};
