// 'localhost';
//'host.docker.internal'

const config = {
  PORT: 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_HOST: 'localhost',
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_URL: 'ds_2',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://@localhost/ds_2',
  API_TOKEN: process.env.API_TOKEN,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
  defaultDaysInPast: 730,
  defaultInterestRate: 15 / 100, // interest Calculation
  defaultInterestMonthsInYear: 12,
  defaultPdfSaveLocation: `${__dirname}/invoices` // PDF Creation
};

module.exports = config;
