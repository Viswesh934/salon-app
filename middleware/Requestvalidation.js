const jwt = require('jsonwebtoken');
const cons= require("../codes")
const Users= require('../models/user');

const checkAuthenticated = async (req, res, next) => {
    try {
        // Get token from request headers
        const token = req.body.token;

        if (!token) {
            return res.status(cons.unauthorized).send(cons.invalidLogin);
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(cons.unauthorized).send(cons.invalidLogin);
        }

        // Attach user object to request for further processing
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(cons.internalerror).send(cons.expired);
    }
};

module.exports = checkAuthenticated;
