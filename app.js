const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Log middleware
app.use((req, res, next) => {
  console.log(`Call to the system at ${new Date().toLocaleString()} to ${req.url}`);
  next();
});

// Integrity check for put/post methods
app.use((req, res, next) => {
  if ((req.method === 'PUT' || req.method === 'POST') && Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "Request body is required for PUT and POST requests" });
  } else {
    next();
  }
});

// Routes
app.use('/products', productController);
app.use('/categories', categoryController);

// CORS
app.use(cors());

// Server start
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});

// 404 Error handling
app.get("*", (req, res) => {
  res.status(404).send('You have an error: Page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error to the console
  res.status(500).json({ error: "An error occurred on the server. Please try again later." });
});
