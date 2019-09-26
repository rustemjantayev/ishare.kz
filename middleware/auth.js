const config = require('config');
const jwt = require('jsonwebtoken');


module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) res.status(401).send('Access Denied. No Token provided');

    try {
        const decoded = jwt.decode(token, config.get('jwtPrivatekey'));
        req.user = decoded
        next();
    } catch (e) {
        res.status(500).send(e.message);
    }
};