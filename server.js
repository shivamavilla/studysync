const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
// app.use(express.json());
const app = express();
const PORT = 5001;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shiva@192810',
  database: 'studysync'
});

db.connect((err) => {
  if (err) {
    console.error(' MySQL connection failed:', err);
  } else {
    console.log(' Connected to MySQL');
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

/** -------------------------------
 * 👇 1. Student creation route
 * -------------------------------- */
// Setup route to insert student
app.post('/students/login', (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body

    // Ensure email and password are provided
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const insertQuery = 'INSERT INTO students (email, password) VALUES (?, ?)';
    db.query(insertQuery, [email, password], (err, result) => {
        if (err) {
            console.error('Error inserting student:', err);
            return res.status(500).send('Error inserting student');
        }

        res.send(' Student inserted successfully');
    });
});


/** -------------------------------
 * 👇 2. Admin login route
 * -------------------------------- */
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admins WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(' Login DB error:', err);
      return res.status(500).json({ success: false });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Admin not found' });
    }

    const admin = results[0];

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) {
        console.error(' Password compare error:', err);
        return res.status(500).json({ success: false });
      }

      if (isMatch) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false, message: 'Invalid password' });
      }
    });
  });
});

/** -------------------------------
 * 👇 3. Get all students
 * -------------------------------- */
app.get('/admin/students', (req, res) => {
  const query = 'SELECT * FROM students';
  db.query(query, (err, results) => {
    if (err) {
      console.error(' Error fetching students:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json(results);
  });
});

/** -------------------------------
 * 👇 Start server
 * -------------------------------- */
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
