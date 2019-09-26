const express = require('express');
const route = express.Router();
const { validateUser, User } = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


route.get('/', async(req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
})


route.post('/', async(req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(404).send(error.details[0].message);

        const user = new User(req.body);
        user.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        const result = await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['username', 'admin']));

    } catch (e) {
        res.status(500).send(e.message)
    }
});

module.exports = route