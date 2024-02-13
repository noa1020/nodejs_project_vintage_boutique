const categories = require('../data/categories.json');
const express = require('express');
const categoriesRouter = express.Router();
const fsPromises = require('fs').promises;


//Add category
categoriesRouter.post('/', async (req, res) => {
    let data = req.body;
    categories.push(data);
    try {
        await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories))
        res.send('The new category: ' + JSON.stringify(data));
    }
    catch (err) {
        console.error(err);
    }
  });
  
  //Update category
  categoriesRouter.put('/', async (req, res) => {
    let data = req.body;
    const categoryIndex = categories.findIndex(category => category.id === data.id);
    if (categoryIndex !== -1) {
        const data = req.body;
        if (data)
        categories[categoryIndex] = data;

        try {
            await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories))
            res.send('Succeeded, the updated category: ' + JSON.stringify(categories[categoryIndex]));
        }
        catch (err) {
            console.error(err);
        }
    }
    else
    res.status(404).json({ error: "category not found" });
  });
  
  
  //delete category
  categoriesRouter.delete('/', async (req, res) => {
    const categoryIndex = categories.findIndex(category => category.id === req.body.id);
    if (categoryIndex !== -1) {
      categories.splice(categoryIndex, 1);
        try {
            await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories))
            res.send('Succeeded');
        }
        catch (err) {
            console.error(err);
        }
    }
    else
        res.status(404).json({ error: "category  found" });
  
  });
  
// Get categories details by ID
categoriesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const category = categories.find((cat) => cat.id ==id);
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