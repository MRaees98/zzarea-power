const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// create connection pool to MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_management_system'
});

// use body-parser middleware to parse request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// handle user registration form submission
router.post('/register/user', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  pool.getConnection(function(err, connection) {
    if (err) {
      return res.status(500).json({
        message: 'Error connecting to database.'
      });
    }

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    connection.query(query, [name, email, password], function(error, results, fields) {
      connection.release();

      if (error) {
        return res.status(500).json({
          message: 'Error registering user.'
        });
      }

      return res.json({
        message: 'User registered successfully.'
      });
    });
  });
});

// handle doctor registration form submission
router.post('/register/doctor', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const specialization = req.body.specialization;

  pool.getConnection(function(err, connection) {
    if (err) {
      return res.status(500).json({
        message: 'Error connecting to database.'
      });
    }

    const query = 'INSERT INTO doctors (name, email, password, specialization) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, email, password, specialization], function(error, results, fields) {
      connection.release();

      if (error) {
        return res.status(500).json({
          message: 'Error registering doctor.'
        });
      }

      return res.json({
        message: 'Doctor registered successfully.'
      });
    });
  });
});

module.exports = router;
