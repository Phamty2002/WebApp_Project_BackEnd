// db.js

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'robertoty',
  password: 'Robertoty2002',
  database: 'foodweb',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL_Database:', err);
    return;
  }
  console.log('Connected to MySQL_Database');
});

module.exports = db;