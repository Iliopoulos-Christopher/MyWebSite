const { exec } = require('child_process');
const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();
const port = 80;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));


const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
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
  let query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to process the login request.' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.status(500).json({ error: 'Failed to process the login request.' });
          } else if (result) {
            res.status(200).send('Logged in successfully!');
          } else {
            res.status(401).send('Incorrect email or password.');
          }
        });
      } else {
        res.status(401).send('Incorrect email or password.');
      }
    }
  });
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email is already in use
  let query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to process the signup request.' });
    } else {
      if (results.length > 0) {
        // Email already in use
        const errorMessage = 'Email already in use!';
        res.status(400).json({ error: errorMessage });
      } else {
        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            res.status(500).json({ error: 'Failed to create a new user.' });
          } else {
            // Create new user
            query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(query, [username, email, hashedPassword], (error, results) => {
              if (error) {
                res.status(500).json({ error: 'Failed to create a new user.' });
              } else {
                // Send the redirect URL in the response
                res.status(201).json({ message: 'User created successfully!', redirect: '/login' });
              }
            });
          }
        });
      }
    }
  });
});

// ... rest of your code ...


app.route('/comments')
  .get((req, res) => {
    const query = 'SELECT * FROM comments ORDER BY created_at ASC';
    db.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to fetch comments.' });
      } else {
        res.status(200).json(results);
      }
    });
  })
  .post((req, res) => {
    const { name, comment } = req.body;

    const query = 'INSERT INTO comments (name, comment) VALUES (?, ?)';
    db.query(query, [name, comment], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to process the comment.' });
      } else {
        res.status(200).json({ message: 'Comment added successfully!', id: results.insertId });
      }
    });
  });

app.put('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const { comment } = req.body;

  const query = 'UPDATE comments SET comment = ? WHERE id = ?';
  db.query(query, [comment, commentId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to update the comment.' });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Comment updated successfully!' });
      } else {
        res.status(404).json({ error: 'Comment not found.' });
      }
    }
  });
});

app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;

  const query = 'DELETE FROM comments WHERE id = ?';
  db.query(query, [commentId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete the comment.' });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Comment deleted successfully!' });
      } else {
        res.status(404).json({ error: 'Comment not found.' });
      }
    }
  });
});


// ...

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Execute the Python script with form information as command-line arguments
  const pythonScript = exec(
    `python3 /home/PersonalWebsight/email_sender.py "${name}" "${email}" "${message}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        res.status(500).send('Failed to send email');
        return;
      }

      console.log(stdout);
      res.status(200).send('Email sent successfully');
    }
  );
});







app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/getusername/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT username FROM users WHERE email = ?';

  db.query(query, [email], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to retrieve the username.' });
    } else {
      if (results.length > 0) {
        const username = results[0].username;
        res.status(200).json({ username });
      } else {
        res.status(404).json({ error: 'Username not found.' });
      }
    }
  });
});
