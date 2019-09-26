const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const config = require("config");
const { port } = require("./config/config.json");
const morgan = require("morgan");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const user = require('./routes/user');
const auth = require('./routes/auth');


//check env varibles
if (!config.get("jwtPrivatekey") && !config.get("mongoDb")) {
    process.exit(1);
}

// database connection
mongoose.connect(config.get("mongoDb"), { useNewUrlParser: true, useUnifiedTopology: true }).then((o) => {
    console.log('Connected mongoose ....');
});

app.use(helmet()); // encription
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny')) // monitoring

app.use('/api/v1/user', user);
app.use('/api/v1/auth', auth);

app.listen(port, () => {
    console.log(`Listen port :  ${port}`);
});