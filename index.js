const express = require('express');
const mysql = require("mysql")

const app = express();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'balaraju'
})

conn.connect((error) => {
    if (error) throw error;
    console.log('Database Connected');
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/users', (req, res) => {
    conn.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        res.send(results);
    })
})

app.listen(3001, (error) => {
    if (error) {
        return console.log(error);
    }
    console.log("Server running at PORT 3001");
})