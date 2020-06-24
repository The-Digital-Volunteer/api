const { join } = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';
const envConfig = require(join(__dirname, 'environments', ENV));

const config = { env: ENV, ...envConfig };

module.exports = config;
