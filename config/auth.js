const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./keys");
const User = require("../model/User");

module.exports = {
    enusureAuthenticated: (req, res, next) => {
        const {authorization} = req.headers;
        if(!authorization) {
           return res.status(401).json({ error: "You must be logged in" })
        }
        const token = authorization.replace("Bearer", "");
        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "You must be logged in" })
            } 
            const {id} = payload;
            User.findById(id)
                .then(auth_user => {
                    req.user = auth_user;
                    next()
                })
                .catch(err => console.error(err))

        })
    }
}