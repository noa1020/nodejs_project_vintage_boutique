const categories = require('../data/categories.json');
const express = require('express');
const categoriesRouter = express.Router();
const fsPromises = require('fs').promises;
const Category = require('../models/categories')

//Add category
categoriesRouter.post('/', async (req, res) => {
  let data = req.body;
  const newCategory = new Category(data.id, data.name);
  try {
    await newCategory.save();
    res.status(201).json(newCategory);  } 
    catch (err) {
      res.status(500).send(err.message)  
    }
});

//Update category
categoriesRouter.put('/:id', async (req, res) => {
  let data = req.body;
  const newCategory = new Category(req.params.id, data.name);
  try {
    await newCategory.update();
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).send(err.message)  
  }

});

//delete category
categoriesRouter.delete('/:id', async (req, res) => {
  const categoryIndex = categories.findIndex(category => category.id == req.params.id);
  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1);
    try {
      await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories))
      res.status(200).send('category deleted successfully');
    }
    catch (err) {
      res.status(500).send(err)  
    }
  }
  else
    res.status(404).json({ error: "category not found" });

});


// Get categories details by ID
categoriesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const category = categories.find((cat) => cat.id == id);
  if (category)
    res.json(category);
  else
    res.status(404).json({ error: "Category not found" });
});


// Get list of all category
categoriesRouter.get('/', (req, res) => {
  if (categories.length > 0)
    res.json(categories.toSorted((a, b) => a.name.localeCompare(b.name)));
  else
    res.status(404).json({ error: "No categories found" });
});


module.exports = categoriesRouter;