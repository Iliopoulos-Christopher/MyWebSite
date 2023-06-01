const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

const mysql = require('mysql');
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Root',
    database: 'website_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Verify user credentials here
    let query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.status(200).json({ success: true });
        }          
        else {
            res.redirect('/login.html'); // Redirect to the login page
        }
    });
});



app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    // Create new user here
    let query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (error, results) => {
        if (error) throw error;

        res.status(201).send('User created successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
