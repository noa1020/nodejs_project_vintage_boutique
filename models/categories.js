const fsPromises = require('fs').promises;
const categories = require('../data/categories.json');

class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    async save() {
        if (!this.id || !this.name) {
            throw new Error('Missing required fields for saving the category.');
        }
        if (categories.find(category => category.id === this.id)) {
            throw new Error('Id category already exists.');
        }
        categories.push(this);
        try {
            await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories));
        } catch (err) {
            console.error(err);
        }
    }

    async update() {
        const categoryIndex = categories.findIndex(category => category.id === this.id);
        if (categoryIndex !== -1) {
            categories[categoryIndex] = this;
            try {
                await fsPromises.writeFile('./data/categories.json', JSON.stringify(categories));
            } catch (err) {
                console.error(err);
            }
        } else {
            throw new Error('Category not found in the database.');
        }
    }
}
module.exports = Category;
