const express = require('express');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');
const ejs = require('ejs');
const hbs = require('handlebars');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const Todo = require('./model/todo.model');


const app = express();

app.set('view engine','ejs');
app.set('view engine','hbs');

mongoose.connect(process.env.db_connection_url).then(()=>console.log('mongoDB is Connected SussesFully....')).catch((error)=>console.log(`error=> ${error}`));

// Set up session and passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Import and configure Passport strategy
const passportLocalStrategy = require('./helper/passport.config');
passportLocalStrategy(passport);

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('Authenticated User:', req.user);
        return next();
    }
    res.redirect('api/user/login');
};


// middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));

app.get('/',isLoggedIn,async (req,res)=>{
try {
        const {user} = req;
        const todo = await Todo.find({userId : user._id , isDeleted :false });
        res.render('index.ejs',{user , todo})
} catch (error) {
    console.log('error',error);
    res.status(500).json({message : 'Internal Server Error '});
}
});

const todoRoute = require('./routes/todo.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/todo/',todoRoute);
app.use('/api/user/',userRoutes);


app.listen(process.env.PORT,()=> console.log(`server Start At Port http://localhost:${process.env.PORT}`))