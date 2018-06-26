
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const replaceId = require('./helpers').replaceId;
const error = require('./helpers').sendErrorResponse;
const util = require('util');
const indicative = require('indicative');
const mongoose = require('mongoose');

// [SH] Bring in the data model
require('../models/db');

var User = mongoose.model('User');

// // GET users
// router.get('/', function (req, res) {
//     User.find(function (err, users) {
//         if (err) return console.err;
//         if (users) {
//             console.log(users);
//             users.forEach((user) => replaceId(user));
            
//         }
//         res.json({ data: users });
//     })
// });

// // GET users
// router.get('/', function (req, res) {
//     User.find().then( (users) => {
//         if (users) {
//             console.log(users);
//             users.forEach((user) => replaceId(user));
//             res.json({ data: users });          
//         }
//     })
// });

// GET users list
router.get('/', function (req, res) {
    const db = req.app.locals.db;
    db.db('login').collection('users').find().toArray(
        function (err, users) {
            if (err) throw err;
            users.forEach((users) => replaceId(users));
            // res.json({ data: users });
			let mapped = users.map(u => (({ id, username, email }) => ({ id, username, email }))(u) );
			res.json({ data: mapped });
        }
    );
});

// GET user by id
router.get('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('users', function (err, users_collection) {
                if (err) throw err;
                users_collection.findOne({ _id: new mongodb.ObjectID(params.userId) },
                    (err, user) => {
                        if (err) throw err;
                        if (user === null) {
                            error(req, res, 404, `User with Id=${params.userId} not found.`, err);
                        } else {
                            replaceId(user);
							// res.json({ data: user });
							let mapped = (({ id, username, email }) => ({ id, username, email }))(user);
							res.json({ data: mapped });
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});

// GET user's projects by id
router.get('/:userId/projects', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('projects', function (err, projects_collection) {
                if (err) throw err;
                projects_collection.find({ authorId: params.userId }).toArray(
                    (err, project) => {
                        if (err) throw err;
                        if (project === null) {
                            error(req, res, 404, `Project with Id=${params.userId} not found.`, err);
                        } else {
							project.forEach((p) => replaceId(p));
                            res.json({ data: project });
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid project ID: ' + util.inspect(errors))
        });
});

// GET user's name by projectId
router.get('/:userId/name', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('users', function (err, users_collection) {
                if (err) throw err;
                users_collection.findOne({ _id: new mongodb.ObjectID(params.userId) },
                    (err, user) => {
                        if (err) throw err;
                        if (user === null) {
                            error(req, res, 404, `User with Id=${params.userId} not found.`, err);
                        } else {
                            replaceId(user);
                            res.json({ data: user.username });
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});

//Post new user
router.post('/', function (req, res) {
    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save(function (err) {
        res.status(200);
        res.json({ data: user });
    });
});

//Delete user by ID
router.delete('/:userId', function (req, res) {
    User.findByIdAndRemove(req.params.userId, function (err, result) {
        if (err) res.send(err);
        else {
            res.json({ data: result });
        }
    })
});



module.exports = router;