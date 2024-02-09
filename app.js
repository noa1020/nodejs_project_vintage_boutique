const express = require('express'); 
const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/products',productController);
app.use('/categories',categoryController);

// Server start
 app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
})

app.get("*",(req, res) => {
    res.status(404).send('You have an error: Page not found');
  })
    
  // Error handling middleware
  app.use((err, req, res, next) => {
      console.error(err); // Log the error to the console
      res.status(500).json({ error: "An error occurred on the server. Please try again later." });
    });
  