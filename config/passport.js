const JwtStartegy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { JWT_SECRET } = require('./keys');
const User = require("../model/User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStartegy(opts, (jwt_playload, done) => {
            User.findById(jwt_playload.id)
                .then(user => {
                    if(user){
                        return done(null, user);
                    }
                    return done(null, false)
                }).catch(err => console.error(err))
        })
    )
}