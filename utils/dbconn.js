const mysql = require("mysql2");

// TODO: Replace with env variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    namedPlaceholders: true,
});

db.connect((err) => {
    if (err) {
        throw err;
    }

    console.log(`Database connection successful!`);
});

module.exports = db;
