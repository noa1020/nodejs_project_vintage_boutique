const express = require('express');
const categoriesRouter = express.Router();
const fsPromises = require('fs').promises;
const Category = require('../models/categories');
const categories = require('../data/categories.json');
const jwt = require('jsonwebtoken');

// Add category
categoriesRouter.post('/', async (req, res) => {

  const token = req.header('Authorization');
  try {
    const decoded = jwt.verify(token, '1234');
    if (decoded.userType === 'manager') {
      const newCategory = new Category(req.body.id, req.body.name);
      await newCategory.save();
      res.status(201).json(newCategory);
    }
    else {
      res.status(500).send("only admin can add category");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
})

// Update category
categoriesRouter.put('/:id', async (req, res) => {
  try {
    const updatedCategory = new Category(req.params.id, req.body.name);
    await updatedCategory.update();
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete category
categoriesRouter.delete('/:id', async (req, res) => {
  try {
    const categories = require('../data/categories.json');
    const category = categories.find((cat) => cat.id == req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    categories = categories.filter((cat) => cat.id !== req.params.id);
    await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories));
    res.status(200).send('Category deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get category by ID
categoriesRouter.get('/:id', (req, res) => {
  const category = categories.find((cat) => cat.id == req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).send("Category not found");
  }
});

// Get all categories
categoriesRouter.get('/', (req, res) => {
  if (categories.length > 0) {
    res.json(categories.sort((a, b) => a.name.localeCompare(b.name)));
  } else {
    res.status(404).send("No categories found");
  }
});

module.exports = categoriesRouter;
