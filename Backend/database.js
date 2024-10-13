const { Client } = require('pg');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "Maverick611"
});

con.connect()
    .then(() => console.log("connected"))
    .catch(err => console.error("connection error", err.stack));

module.exports = con;  // Export the connection

