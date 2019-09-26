const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { validateUser, User } = require('../models/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


route.get('/', async(req, res) => {
    try {
        //validate input params
        const { error } = validate(req.body);
        if (error) return res.status(404).send(error.details[0].message);

        // cheack user
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send('Invalidd login or password..');

        // validatate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalidd login or password..');

        //ganerating token model/user.js
        const token = user.generateAuthToken();

        // set token 
        res.header('x-auth-token', token).send(_.pick(user, ['username', 'admin']));
    } catch (e) {
        res.status(500).send(e.message);
    }
})

function validate(auth) {
    return Joi.validate(auth, {
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required()
    });
}



module.exports = route;