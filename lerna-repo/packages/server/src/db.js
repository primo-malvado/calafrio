const knex = require("knex");

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../knexfile.js')[env];

module.exports = knex(config);