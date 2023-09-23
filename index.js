const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const ejs = require('ejs');
const routes = require('./routes');
app.use('/', routes);

// configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure static folder for CSS
app.use(express.static('public'));

// configure EJS as the view engine
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_management_system'
});

connection.connect((error) => {
  if (error) {
    console.error(`Error connecting to MySQL database: ${error}`);
    return;
  }
  console.log('Connected to MySQL database');
});

// create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_management_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register/user', (req, res) => {
  // retrieve user data from the request body
  const { name, email, password } = req.body;

  // validate user data
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Log the user registration data to the console
  console.log(`User registration data: Name=${name}, Email=${email}, Password=${password}`);

  // save user data to database
  const sql = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
  const values = [name, email, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/register/doctor', (req, res) => {
  // retrieve doctor data from the request body
  const { name, email, password, specialization } = req.body;

  // validate doctor data
  if (!name || !email || !password || !specialization) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Log the doctor registration data to the console
  console.log(`Doctor registration data: Name=${name}, Email=${email}, Password=${password}, Specialization=${specialization}`);

  // save doctor data to database
  const sql = `INSERT INTO doctors (name, email, password, specialization) VALUES ('${name}', '${email}', '${password}', '${specialization}')`;
  const values = [name, email, password, specialization];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ message: 'Doctor registered successfully' });
  });
});

app.post('/add-specialization', function(req, res) {
  var specialization = req.body.specialization;

  // perform validation on the specialization
  if (!specialization) {
    return res.status(400).json({
      message: 'Specialization is required'
    });
  }

  // save the specialization to the database
  const sql = `INSERT INTO specializations (specialization) VALUES ('${specialization}')`;
  const values = [specialization];

  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'An error occurred while adding the specialization'
      });
    }

    return res.status(200).json({
      message: 'Specialization added successfully'
    });
  });
});



// start the server
app.listen(3000, () => console.log('Server is running on port 3000'));
