const express = require('express');
const productsRouter = express.Router();
const products = require('../data/products.json');
const fsPromises = require('fs').promises;
const Product = require('../models/product');

//Add product
productsRouter.post('/', async (req, res) => {
  let data = req.body;
  const newProduct = new Product(data.id, data.name, data.price, data.categoryId);
  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  }
  catch (err) {
    res.status(500).send(err.message)
  }
});

//Update product
productsRouter.put('/:id', async (req, res) => {
  let data = req.body;
  const newProduct = new Product(req.params.id, data.name, data.price, data.categoryId);
  try {
    await newProduct.update();
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).send(err.message)
  }

});

//delete product
productsRouter.delete('/:id', async (req, res) => {
  const productIndex = products.findIndex(product => product.id == req.params.id);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    try {
      await fsPromises.writeFile('./data/products.json', JSON.stringify(products))
      res.status(200).send('Product deleted successfully');
    }
    catch (err) {
      res.status(500).send(err)
    }
  }
  else
    res.status(404).send("product not found");

});

// Get products details by categoryID
productsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  let newProductList = products.filter(p => p.category_id === id);
  if (newProductList.length > 0) {
    res.json(newProductList.sort((a, b) => a.name.localeCompare(b.name)));
  }
  else
    res.status(404).send("categoty not found");
});


// Get list of all product
productsRouter.get('/', (req, res) => {
  if (products.length > 0)
    res.json(products.toSorted((a, b) => a.name.localeCompare(b.name)));
  else
    res.status(404).send("No products found");
});

module.exports = productsRouter;