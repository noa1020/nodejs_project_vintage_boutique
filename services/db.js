const mongoose = require('mongoose');
main().catch(err => console.log(err));
mongoose.set("strictQuery", false);
async function main() {
    await mongoose.connect('mongodb://localhost/vintage_boutique');
}
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    _id: Number,
    name: String,
});
const productSchema = new Schema({
    _id: Number,
    name: String,
    price: Number,
    categoryId: Number,
});
const userSchema = new Schema({
    _id: Number,
    name: String,
    password: String,
    userType: String,
});
const CategoryModel = mongoose.model("categories", categorySchema);
const ProductModel = mongoose.model("products", productSchema);
const UserModel = mongoose.model("users", userSchema);
module.exports = { CategoryModel, ProductModel, UserModel };
