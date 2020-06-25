const { join } = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';
/* eslint-disable */
const envConfig = require(join(__dirname, 'environments', ENV));
/* eslint-enable */

const config = { env: ENV, ...envConfig };

module.exports = config;
