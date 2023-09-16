import { useState } from 'react';
import { Stack, Divider, Button, Box, Alert } from '@mui/material';

export default function InvoiceDetails({ invoiceData, postStatus }) {
   const { invoiceDetails = {} } = invoiceData ?? {};

   return (
      <>
         <Stack style={styles.tableContainer}>
            <table style={styles.tableWrapper}>
               <tbody>
                  <tr>
                     <th style={styles.thStyle}>Company Name:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Name:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Billing Address:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Is Billing Address Active:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Mailing Address:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Is Mailing Address Active:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Cell:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Email:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
               </tbody>
            </table>

            <table style={styles.tableWrapper}>
               <tbody>
                  <tr>
                     <th style={styles.thStyle}>Billable:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Last Billed:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Invoice Due Date:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Last Statement Balance:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Multiple Outstanding Invoices:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
                  <tr>
                     <th style={styles.thStyle}>Current Outstanding Invoices Total:</th>
                     <td style={styles.tdStyle}>N/A</td>
                  </tr>
               </tbody>
            </table>
            <Box>
               <Button>Download Invoice</Button>
            </Box>
         </Stack>
         {postStatus && <Alert severity={postStatus.status === 200 ? 'success' : 'error'}>{postStatus.message}</Alert>}
         <Divider style={styles.divider} />
      </>
   );
}

const styles = {
   component: {
      paddingBottom: '20px'
   },
   tableContainer: {
      padding: '6px 0px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
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
