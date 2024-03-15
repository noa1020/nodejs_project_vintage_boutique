const { CategoryModel } = require('../services/db');

class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // Add category
    async save() {
        if (!this.id || !this.name) {
            throw new Error('Missing required fields for saving the category.');
        }
        const existingCategory = await CategoryModel.findById(parseInt(this.id));
        if (existingCategory) {
            throw new Error('Category with this ID already exists.');
        }
        const newCategory = new CategoryModel({
            _id: parseInt(this.id),
            name: this.name,
        });
        console.log(newCategory);
        await newCategory.save();
    }

    // Update category
    async update() {
        const existingCategory = await CategoryModel.findById(this.id);

        if (existingCategory) {
            existingCategory.name = this.name;
            await existingCategory.save();
        } else {
            throw new Error('Category not found for update.');
        }
    }
}
module.exports = Category;
