const mysql = require("mysql");

// Mysql codes below
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  acquireTimeout: process.env.ACQUIRETIMEOUT,
});

module.exports = pool;
