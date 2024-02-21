const fsPromises = require('fs').promises;
const { error } = require('console');
const products = require('../data/products.json');

class Product {
    constructor(id, name, price, categoryId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
    }

    async save() {
        if (!this.id || !this.name || !this.price || !this.categoryId) {
            throw new Error('Missing required fields for saving the product.');
        }
        if (products.find(product => product.id === this.id)) {
            throw new Error('Id product already exists.');
        }
        products.push(this);
        try {
            await fsPromises.writeFile('./data/products.json', JSON.stringify(products));
        } catch (err) {
            console.error(err);
        }
    }

    async update() {
        const productIndex = products.findIndex(product => product.id === this.id);
        if (productIndex !== -1) {
            products[productIndex] = this;
            try {
                await fsPromises.writeFile('./data/products.json', JSON.stringify(products));
            } catch (err) {
                console.error(err);
            }
        } else {
            throw new Error('Product not found in the database.');
        }
    }
}
module.exports = Product;
