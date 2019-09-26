const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

function validateUser(user) {
    return Joi.validate(user, {
        username: Joi.string().min(5).max(25).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(10),
        admin: Joi.boolean().default(false)
    });
}

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    console.log(this);
    return jwt.sign({ id: this._id, admin: this.admin }, config.get('jwtPrivatekey'));
}
const User = mongoose.model('Users', userSchema);

module.exports.validateUser = validateUser;
module.exports.User = User;