const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user.model'); // Adjust the path to your User model
const bcrypt = require('bcrypt');
const passportLocalStrategy = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email' // Use email instead of username
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email , isDeleted : false });
                if (!user) {
                    return done(null, false);
                }
                // Compare hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                if(isMatch) return  done(null , false);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

module.exports = passportLocalStrategy;
