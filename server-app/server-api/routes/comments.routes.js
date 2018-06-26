const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const replaceId = require('./helpers').replaceId;
const error = require('./helpers').sendErrorResponse;
const util = require('util');
const indicative = require('indicative');


// GET all comments
router.get('/', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.db('login').collection('comments').find().toArray(
        function (err, comments) {
            if (err) throw err;
            comments.forEach((comment) => replaceId(comment));
            res.json({ data: comments });
        }
    );
});

// GET comments by userId
router.get('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('comments', function (err, comments_collection) {
                if (err) throw err;
                comments_collection.find({ authorId: params.userId }).toArray(
                    (err, comments) => {
                        if (err) throw err;
                        if (comments === null) {
                            error(req, res, 404, `Comment with user ID=${params.userId} not found.`, err);
                        } else {
							comments.forEach((comment) => replaceId(comment));
                            res.json({ data: comments }); //да връща целия обект или само текста???
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});


// PUT (edit) comment 
router.put('/:commentId', function (req, res) {
    const db = req.app.locals.db;
    const comment = req.body;
    if (comment.id !== req.params.commentId) {
        error(req, res, 400, `Invalid data - id in url doesn't match: ${comment}`);
        return;
    }
    const collection = db.db('login').collection('comments');
    comment._id = new mongodb.ObjectID(comment.id);
    delete (comment.id);
    console.log('Editing comment:', comment);
    collection.updateOne({ _id: new mongodb.ObjectID(comment._id) }, { "$set": comment })
        .then(result => {
            const resultComment = replaceId(comment);
            if (result.result.ok && result.modifiedCount === 1) {
                res.json({ data: resultComment });
            } else {
                error(req, res, 400, `Data was NOT modified in database: ${JSON.stringify(comment)},
                maybe there is no change`);
            }
        }).catch((err) => {
            error(req, res, 500, `Server error: ${err}`, err);
        })
    // }).catch(errors => {
    //     error(req, res, 400, `Invalid project data: ${util.inspect(errors)}`);
});

// DELETE comments
router.delete('/:commentId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.db('login').collection('comments').findOneAndDelete({ _id: new mongodb.ObjectID(params.commentId) },
        function (err, result) {
            if (err) throw err;
            if (result.ok) {
                replaceId(result.value);
                res.json({ data: result.value });
            } else {
                error(req, res, 404, `Comment with Id=${params.commentId} not found.`, err);
            }
        });
});

// // Post new comment
// router.post('/', function (req, res) {
//     const db = req.app.locals.db;
//     const params = req.params;
//     const comment = req.body;
//     const collection = db.db('login').collection('comments');
//     console.log('Inserting comment:', comment);

//     collection.insertOne(comment).then((result) => {
//         if (result.result.ok && result.insertedCount === 1) {
//             replaceId(comment);
//             const uri = req.baseUrl + '/' + comment.id;
//             console.log('Created comment: ', uri);
//             res.location(uri).status(201).json({ data: comment });
//         } else {
//             error(req, res, 400, `Error creating new commnet: ${comment}`);
//         }
//     }).catch((err) => {
//         error(req, res, 500, `Server error: ${err}`, err);
//     })
//     // }).cah(errors => {
//     //     error(rtceq, res, 400, `Invalid project data: ${util.inspect(errors)}`);
// });

module.exports = router;