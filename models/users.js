const bcrypt = require('bcrypt');
const { UserModel } = require('../services/db');

class User {
    constructor(id, name, password, userType) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.userType = userType;
    }

    async save() {
        if (!this.id || !this.name || !this.password || !this.userType) {
            throw new Error('Missing required fields for saving the user.');
        }
        const existingUser = await UserModel.findById(this.id);
        if (existingUser) {
             throw new Error('User with this ID already exists.');
         }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(this.password, 10);
        const user = new UserModel({
            _id: parseInt(this.id),
            name: this.name,
            password: hashedPassword,
            userType: this.userType
        });
        await user.save();
    }
}

module.exports = User;
