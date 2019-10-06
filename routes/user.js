const express = require('express');
const route = express.Router();
const { validateUser, User, validateUpUser } = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const auth = require('../middleware/auth');

//returns curreent user
route.get('/me', auth, async(req, res) => {
    try {
        if (!req) return res.status(401).send("Access denied...");

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message);
    }
});


route.get('/:username', auth, async(req, res) => {
    try {
        const users = await User.findOne({ username: req.params.username }).select('username');

        res.send(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

route.put('/me', auth, async(req, res) => {
    const { error } = validateUpUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log(req.user)
    const user = await User.updateOne({ _id: req.user.id }, { $set: req.body });


    res.send(user);
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