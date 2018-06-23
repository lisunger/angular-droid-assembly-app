/*
 * Copyright (c) 2015-2018 IPT-Intellectual Products & Technologies (IPT).
 * All rights reserved.
 * 
 * This software provided by IPT-Intellectual Products & Technologies (IPT) is for 
 * non-commercial illustartive and evaluation purposes only. 
 * It is NOT SUITABLE FOR PRODUCTION purposes because it is not finished,
 * and contains security flаws and weaknesses (like sending the passwords and 
 * emails of users to the browser client, wich YOU SHOULD NEVER DO with real user
 * data). You should NEVER USE THIS SOFTWARE with real user data.
 * 
 * This file is licensed under terms of GNU GENERAL PUBLIC LICENSE Version 3
 * (GPL v3). The full text of GPL v3 license is providded in file named LICENSE,
 * residing in the root folder of this repository.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * IPT BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const mongoose = require('mongoose');


const rootPath = path.normalize(path.join(__dirname, '..'));
const projectRoutes = require('./routes/projects.routes');
const commentRoutes = require('./routes/comments.routes');
// [SH] Bring in the data model
require('./models/db');
// [SH] Bring in the Passport config after mongo and model is defined and after
require('./passport');

const app = express();

// [SH] Initialise Passport before using the route middleware
var User = mongoose.model('User');
var Todo = mongoose.model('Todo' );

// view engine setup
app.set('app', path.join(rootPath, 'app'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

// Route to  REST API top-level resources
app.use('/api/comments', commentRoutes);
app.use('/api/projects', projectRoutes);


//app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));


// Get todos from db
app.get('/api/todos', function (req, res) {
  Todo.find(function (err, todos) {
    if (err) return console.err;
    res.send(todos);
  })
    
});



// First login to receive a token
app.post('/api/sign-in', function (req, res) {
  passport.authenticate('local', function (err, user, info) {  // If this function gets called, authentication was successful.
    var secret = "super secret";
    // console.log.req.body.password;
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    } else {
      return res.json({ 
        username : user.username,
        token: jwt.sign({ id: user._id },secret ) });  //return only the token
    }

    // else {
    //   // If user is not found
    //   res.status(401).json(info ili info.message);
    // }

  })(req, res);
});

app.post('/api/register', function (req, res) {

  var user = new User();

  user.username = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  //user.password = user.setPassword(req.body.password);


  user.save(function (err) {  //saving the new user in the DB
   // var token;
    //token = user.generateJwt();
    res.status(200);
    // res.json({
    //   "token": token
    // });
    res.send("Successful registration");
  });

    //В клиента да се навигира към /login след регистрация
  });







// // Load the user from "database" if token found
// app.use(function (req, res, next) {
//   if (req.tokenPayload) {
//     req.user = users[req.tokenPayload.id];
//   }
//   if (req.user) {
//     return next();
//   } else {
//     return res.status(401).json({ status: 'error', code: 'unauthorized' });
//   }
// });




// // Protect other routes
// app.use((req, res, next) => {
//   if (isAuthorized(req)) {
//     console.log('Access granted');
//     next();
//   } else {
//     console.log('Access denied, invalid JWT');
//     res.sendStatus(401);
//   }
// });




/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });
}

//  //Add db as app local property
// app.locals.db = require('./models/db').db;

//Connection URL to db
const url = 'mongodb://localhost:27017/';
  
//Use connect to connectmon to db
MongoClient.connect(url, { db: { w: 1 } }).then((db) => {
  if (db === null) {
    throw new Error(`Can not connect to database: ${url}`);
  }
  console.log(`Successfully connected to MongoDB server at: ${url}`);

  //Add db as app local property
  app.locals.db = db;

// Starting the server
app.listen(9000, (err) => {
  if (err) {
    throw err;
  }
  console.log('WebStore Service API listening on port 9000.')
})}).catch((err) => { throw err; });








// Check whether request is allowed
function isAuthorized(req) {
  let bearer = req.get('Authorization');
  if (bearer === 'Bearer ' + jwtToken) {
    return true;
  }
  return false;
}
