require("dotenv").config();
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require("express-session")
const passport = require('passport')
var indexRouter = require('./routes/indexRoute.js');
var usersRouter = require('./models/users.js');
var cors = require("cors")
const ErrorHandler = require("./utils/ErrorHandler.js");
const { generatedErrors } = require("./middleWares/errors.js");

// Database connection
require("./models/dataBase.js").connectDatabse();



// const allowedOrigins =["http://localhost:5173"]
const allowedOrigins =["https://frontend-deploy-alpha.vercel.app"]






app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:"hello bhai"
  }))

  
 
  
  app.use(cors({origin:allowedOrigins, credentials: true ,})) 

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//Routes
app.use('/', indexRouter);



// Error handling for undefined routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL not found: ${req.url}`, 404));
});


module.exports = app;
