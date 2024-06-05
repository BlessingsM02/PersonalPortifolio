const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Notify me after every message
const notifyNewMessage = (name, email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MY_EMAIL,
    subject: 'Portifio Message',
    text: `You have a new message from:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
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
