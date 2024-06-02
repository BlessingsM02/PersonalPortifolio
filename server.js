const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('contacts.db');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create contacts table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `);
});

//Notify me after every message
const notifyNewMessage = (name, email, message) => {
  console.log(`New message received from ${name}`);
};

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  const stmt = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
  stmt.run(name, email, message, function(err) {
    if (err) {
      res.status(500).send('Error saving message');
    } else {
      res.status(200).send('Message saved successfully');
      notifyNewMessage(name, email, message);
    }
  });
  stmt.finalize();
});

app.get('/api/messages', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      res.status(500).send('Error retrieving messages');
    } else {
      res.json(rows);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
