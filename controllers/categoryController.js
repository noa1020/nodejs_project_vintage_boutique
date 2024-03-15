const express = require('express');
const categoriesRouter = express.Router();
const Category = require('../models/categories');
const { CategoryModel } = require('../services/db');
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
  const token = req.header('Authorization');
  try {
    const decoded = jwt.verify(token, '1234');
    if (decoded.userType === 'manager') {
      const updatedCategory = new Category(req.params.id, req.body.name);
      await updatedCategory.update();
      res.status(200).json(updatedCategory);
    }
    else {
      res.status(500).send("only admin can add category");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete category
categoriesRouter.delete('/:id', async (req, res) => {
  const token = req.header('Authorization');
  try {
    const decoded = jwt.verify(token, '1234');
    if (decoded.userType === 'manager') {
      const category = await CategoryModel.findOneAndDelete({ _id: parseInt(req.params.id) });
      if (category) {
        res.send('The category was successfully deleted');
      } else {
        res.status(404).send('Category not found');
      }
    } else {
      res.status(403).send("Only admin can delete category");
    }
  } catch (error) {
    res.status(500).send('Error deleting category');
  }
});

// Get category by ID
categoriesRouter.get('/:id', async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ _id: req.params.id }).select({ id: 1, name: 2 }).exec();
    if (category) {
      res.send(category);
    } else {
      res.status(404).send('Category not found');
    }
  } catch (error) {
    res.status(500).send('Category fetching error');
  }
});

// Get all categories
categoriesRouter.get('/', async (req, res) => {
  try {
    const categories = await CategoryModel.find({}, { id: 1, name: 1 }).sort({ name: 1 });
    if (categories) {
      res.send(categories);
    } else {
      res.status(404).send('No categories found');
    }
  } catch (error) {
    res.status(500).send('Error fetching categories');
  }
});
module.exports = categoriesRouter;
