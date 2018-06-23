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
                comments_collection.findOne({ userId: params.userId },
                    (err, comments) => {
                        if (err) throw err;
                        if (comments === null) {
                            error(req, res, 404, `Comment with user ID=${params.userId} not found.`, err);
                        } else {
                           // console.log(comments); // какво връща find()?
                            res.json({ data: comments }); //връща се целият обект или само текста???
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});


// // GET comments by projectId
// router.get('/projectId', function (req, res) {
//     const db = req.app.locals.db;
//     const params = req.params;

//     indicative.validate(params, { projectId: 'required|regex:^[0-9a-f]{24}$' })
//         .then(() => {
//             db.db('login').collection('comments', function (err, comments_collection) {
//                 if (err) throw err;
//                 comments_collection.find({ projectId: new mongodb.ObjectID(params.projectId) },
//                     (err, comments) => {
//                         if (err) throw err;
//                         if (comments === null) {
//                             error(req, res, 404, `Comment with project ID=${params.projectId} not found.`, err);
//                         } else {
//                             console.log(comments); // какво връща find()?
//                             res.json({ data: comments }); //връща се целият обект или само текста???
//                         }
//                     });
//             });
//         }).catch(errors => {
//             error(req, res, 400, 'Invalid project ID: ' + util.inspect(errors))
//         });
// });


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

// Post new comment
router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    const comment = req.body;
    const collection = db.db('login').collection('comments');
    console.log('Inserting comment:', comment);

    collection.insertOne(comment).then((result) => {
        if (result.result.ok && result.insertedCount === 1) {
            replaceId(comment);
            const uri = req.baseUrl + '/' + comment.id;
            console.log('Created comment: ', uri);
            res.location(uri).status(201).json({ data: comment });
        } else {
            error(req, res, 400, `Error creating new commnet: ${comment}`);
        }
    }).catch((err) => {
        error(req, res, 500, `Server error: ${err}`, err);
    })
    // }).cah(errors => {
    //     error(rtceq, res, 400, `Invalid project data: ${util.inspect(errors)}`);
});

module.exports = router;