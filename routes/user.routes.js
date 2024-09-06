const express = require('express');
const userRoutes = express.Router();
const passport = require('passport');

const { login , register, registerUser, logoutUser} = require('../controller/user.controller');

// /api/user/
userRoutes.get('/login', login);
userRoutes.get('/register', register);

userRoutes.post('/registerUser', registerUser);
// userRoutes.post('/loginUser', loginUser);
userRoutes.post('/loginUser', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

userRoutes.get('/logout', logoutUser);

module.exports = userRoutes;