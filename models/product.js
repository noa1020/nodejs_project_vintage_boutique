const { ProductModel } = require('../services/db');

class Product {
    constructor(id, name, price, categoryId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
    }

    // Add product
    async save() {
        if (!this.id || !this.name || !this.price || !this.categoryId) {
            throw new Error('Missing required fields for saving the product.');
        }
        const existingProduct = await ProductModel.findById(parseInt(this.id));
        if (existingProduct) {
            throw new Error('Product with this ID already exists.');
        }
        const product = new ProductModel({
            _id: parseInt(this.id),
            name: this.name,
            price: parseInt(this.price),
            categoryId: parseInt(this.categoryId),
        });
        await product.save();
    }

    // Update product
    async update() {
        const existingProduct = await ProductModel.findById(this.id);
        if (existingProduct) {
            existingProduct.name = this.name;
            existingProduct.price = parseInt(this.price);
            existingProduct.categoryId = parseInt(this.categoryId);
            await existingProduct.save();
        } else {
            throw new Error('Product not found for update.');
        }
    }
}
module.exports = Product;
