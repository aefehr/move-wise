const mysql = require('mysql');
const config = require('./config.json'); 

const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});

connection.connect(err => {
    if (err) {
        return console.error('Error connecting: ' + err.stack);
    }
    console.log('Connected as id ' + connection.threadId);
});
