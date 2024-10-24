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
const session = require("express-session");

// Database connection
require("./models/dataBase.js").connectDatabse();




const allowedOrigins = ["http://localhost:5173", "https://frontend-deploy-alpha.vercel.app"];

// CORS middleware
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// app.options('*', cors());
// app.use(cors({origin:allowedOrigins,  methods: 'GET,POST,PUT,DELETE', credentials: true})) 

const generatedErrror = (err,req,res,next)=>{
  const statuscode = err.statuscode || 500;
  if (err.name === "MongoServerError" && err.message.includes("E11000 duplicate key ")) {
      err.message = " email or password already exist"
  }
  res.status(statuscode).json({
      message:err.message,
      errName:err.name,
      // stack:err.stack
  })
  }




app.use(
  session({
    resave:false,
    saveUninitialized:false,
    secret:"hellobhai"
  }))

  
 
  
  

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//Routes
app.use('/', indexRouter);



// Error handling for undefined routes

app.all("*",(req,res,next)=>{
  next(new errorHanler(`requested url not found ${req.url}`,404))
})
app.use(generatedErrror)

module.exports = app;
