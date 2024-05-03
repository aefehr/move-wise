const mysql = require('mysql2/promise');
const config = require('./config.json'); // Adjust the path if config.json is not in the same directory

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});

module.exports = pool;
