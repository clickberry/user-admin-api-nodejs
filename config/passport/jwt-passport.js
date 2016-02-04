var JwtStrategy = require('passport-jwt').Strategy;
var error = require('clickberry-http-errors');
var config = require('clickberry-config');

module.exports = function (passport) {
    passport.use('access-token', new JwtStrategy({
        secretOrKey: config.get('token:accessSecret')
    }, function (jwtPayload, done) {
        if (jwtPayload.role == 'admin') {
            done(null, jwtPayload);
        } else {
            done(new error.Forbidden());
        }
    }));
};