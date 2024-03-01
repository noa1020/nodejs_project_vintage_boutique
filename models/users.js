const fsPromises = require('fs').promises;
const { error } = require('console');
const users = require('../data/users.json');
const bcrypt = require('bcrypt');

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
        if (users.find(user => user.id === this.id)) {
            throw new Error('Id user already exists.');
        }
        // Hash the password before storing it
        const hashedPassword = bcrypt.hashSync(this.password, 10);
        this.password = hashedPassword;
        users.push(this);
        try {
            await fsPromises.writeFile('./data/users.json', JSON.stringify(users));
        } catch (err) {
            console.error(err);
        }
    }

}
module.exports = User;
