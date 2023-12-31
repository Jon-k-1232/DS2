const app = require('./app');
const https = require('https');
const fs = require('fs');
const { NODE_PORT, HOST_IP, DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, NODE_ENV } = require('../config');
const knex = require('knex');

const db = knex({
   client: 'postgres',
   connection: {
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_URL
   }
});

app.set('db', db);

if (NODE_ENV === 'production') {
   const sslOptions = {
      key: fs.readFileSync('/app/ssl/192.168.12.209.key'),
      cert: fs.readFileSync('/app/ssl/192.168.12.209.crt')
   };

   // Create HTTPS server
   https.createServer(sslOptions, app).listen(NODE_PORT, HOST_IP, () => {
      console.log(`Server listening at https://${HOST_IP}:${NODE_PORT}`);
   });
   // app.listen(NODE_PORT, HOST_IP, () => {
   //    console.log(`Server listening at http://${HOST_IP}:${NODE_PORT}`);
   // });
} else {
   app.listen(NODE_PORT, HOST_IP, () => {
      console.log(`Server listening at http://${HOST_IP}:${NODE_PORT}`);
   });
}
