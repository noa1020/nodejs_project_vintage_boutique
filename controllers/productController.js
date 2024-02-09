const { log } = require('console');
const products = require('../data/products.json');
const express = require('express');
const productsRouter = express.Router();
const fsPromises = require('fs').promises;


//Add product
productsRouter.post('/', async (req, res) => {
    let data = req.body;
    products.push(data);
    try {
        await fsPromises.writeFile('./data/products.json', JSON.stringify(products))
        res.send('The new product: ' + JSON.stringify(data));
    }
    catch (err) {
        console.error(err);
    }
  });
  
  //Update product
  productsRouter.put('/', async (req, res) => {
    let data = req.body;
    const productIndex = products.findIndex(product => product.id === data.id);
    if (productIndex !== -1) {
        const data = req.body;
        if (data)
        products[productIndex] = data;
        try {
            await fsPromises.writeFile('./data/products.json', JSON.stringify(products))
            res.send('Succeeded, the updated product: ' + JSON.stringify(products[productIndex]));
        }
        catch (err) {
            console.error(err);
        }
    }
    else
    res.status(404).json({ error: "product not found" });
  });
  
  //delete product
  productsRouter.delete('/', async (req, res) => {
    const productIndex = products.findIndex(product => product.id == req.body.id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
        try {
            await fsPromises.writeFile('./data/products.json', JSON.stringify(products))
            res.send('Succeeded');
        }
        catch (err) {
            console.error(err);
        }
    }
    else
        res.status(404).json({ error: "product not found" });
  
  });
  
// Get products details by categoryID
productsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  let newProductList = products.filter(p => p.category_id === id);
  if (newProductList.length>0){
    res.json(newProductList.sort((a, b) => a.name.localeCompare(b.name)));
  }
  else
    res.status(404).json({ error: "product not found" });
});


// Get list of all product
productsRouter.get('/', (req, res) => {
  if (products.length > 0)
    res.json(products.sort((a, b) => a.name.localeCompare(b.name)));
  else
    res.status(404).json({ error: "No products found" });
});


module.exports = productsRouter;