const app = require('./app');
const { NODE_PORT, DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, NODE_ENV } = require('../config');
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

app.listen(NODE_PORT, () => {
  if (NODE_ENV !== 'development') {
    console.log(`Server listening at http://localhost:${NODE_PORT}`);
  }
});
