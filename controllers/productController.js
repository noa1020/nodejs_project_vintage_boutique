const express = require('express');
const productsRouter = express.Router();
const Product = require('../models/product');
const { ProductModel } = require('../services/db');

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

// Delete product
productsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOneAndDelete({ _id: parseInt(id) });
    if (product) {
      res.send('The product deleted successfully');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
});

// Get products details by category ID
productsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const productList = await ProductModel.find({ categoryId: parseInt(req.params.id) }).select({ _id: 1, name: 1, categoryId: 1, price: 1 });
    if (productList.length > 0) {
      const sortedProductList = productList.sort((a, b) => a.name.localeCompare(b.name));
      res.json(sortedProductList);
    } else {
      res.status(404).send('Category not found');
    }
  } catch (error) {
    res.status(500).send('An error occurred while fetching the products');
  }
});

// Get list of all products
productsRouter.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find({}, { _id: 1, name: 1, price: 1, categoryId: 1 }).sort({ name: 1 });
    res.send(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});
module.exports = productsRouter;