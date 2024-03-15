const express = require('express');
const usersRouter = express.Router();
const user = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require('../services/db');

// User Registration (Sign Up)
usersRouter.post('/signup', async (req, res) => {
    const { name, id, password, userType } = req.body;
    const newUser = new user(id, name, password, userType);
    try {
        await newUser.save();
        res.status(201).json("User registered successfully");
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

// User Login
usersRouter.post('/login', async (req, res) => {
    const { id, password } = req.body;
    // Find the user by id
    const newuser = await UserModel.findById(parseInt(id));
    if (!newuser || !bcrypt.compareSync(password, newuser.password)) {
        return res.status(401).json({ message: 'Invalid id or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: newuser.id, userType: newuser.userType }, '1234', { expiresIn: '1h' });
    newuser.token = token
    res.header("Authorization", token).send({ "token": token });
});

module.exports = usersRouter;
