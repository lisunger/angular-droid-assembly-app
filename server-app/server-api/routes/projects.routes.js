
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const replaceId = require('./helpers').replaceId;
const error = require('./helpers').sendErrorResponse;
const util = require('util');
const indicative = require('indicative');


// GET projects list
router.get('/', function (req, res) {
    const db = req.app.locals.db;
    db.db('login').collection('projects').find().toArray(
        function (err, projects) {
            if (err) throw err;
            projects.forEach((project) => replaceId(project));
            res.json({ data: projects });
        }
    );
});


// GET project by id
router.get('/:projectId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { projectId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('projects', function (err, projects_collection) {
                if (err) throw err;
                projects_collection.findOne({ _id: new mongodb.ObjectID(params.projectId) },
                    (err, project) => {
                        if (err) throw err;
                        if (project === null) {
                            error(req, res, 404, `Project with Id=${params.projectId} not found.`, err);
                        } else {
                            replaceId(project);
                            res.json({ data: project });
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid project ID: ' + util.inspect(errors))
        });
});

// Create new project
router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const project = req.body;
    const collection = db.db('login').collection('projects');
    console.log('Inserting project:', project);
    collection.insertOne(project).then((result) => {
        if (result.result.ok && result.insertedCount === 1) {
            replaceId(project);
            const uri = req.baseUrl + '/' + project.id;
            console.log('Created project: ', uri);
            res.location(uri).status(201).json({ data: project });
        } else {
            error(req, res, 400, `Error creating new project: ${project}`);
        }
    }).catch((err) => {
        error(req, res, 500, `Server error: ${err}`, err);
    })
    // }).cah(errors => {
    //     error(rtceq, res, 400, `Invalid project data: ${util.inspect(errors)}`);
});

// GET comments by projectId
router.get('/:projectId/comments', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    indicative.validate(params, { projectId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('comments', function (err, comments_collection) {
                if (err) throw err;
                comments_collection.find({ projectId: params.projectId }).toArray(
                    (err, comments) => {
                        if (err) throw err;
                        if (comments === null) {
                            error(req, res, 404, `Comment with project ID=${params.projectId} not found.`, err);
                        } else {
                            console.log(comments); // какво връща find()?
                            res.json({ data: comments }); //връща се целият обект или само текста???
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid project ID: ' + util.inspect(errors))
        });
});

// GET project's name by projectId
router.get('/:projectId/name', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { projectId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.db('login').collection('projects', function (err, projects_collection) {
                if (err) throw err;
                projects_collection.findOne({ _id: new mongodb.ObjectID(params.projectId) },
                    (err, project) => {
                        if (err) throw err;
                        if (project === null) {
                            error(req, res, 404, `Project with Id=${params.projectId} not found.`, err);
                        } else {
                            replaceId(project);
                            res.json({ data: project.title });
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid project ID: ' + util.inspect(errors))
        });
});


// Post new comment to project
router.post('/comments', function (req, res) {
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
            error(req, res, 400, `Error creating new commentt: ${comment}`);
        }
    }).catch((err) => {
        error(req, res, 500, `Server error: ${err}`, err);
    })
    // }).cah(errors => {
    //     error(rtceq, res, 400, `Invalid project data: ${util.inspect(errors)}`);
});


// PUT (edit) project by id
router.put('/:projectId', function (req, res) {
    const db = req.app.locals.db;
    const project = req.body;
    if (project.id !== req.params.projectId) {
        error(req, res, 400, `Invalid project data - id in url doesn't match: ${project}`);
        return;
    }
    const collection = db.db('login').collection('projects');
    project._id = new mongodb.ObjectID(project.id);
    delete (project.id);
    console.log('Updating project:', project);
    collection.updateOne({ _id: new mongodb.ObjectID(project._id) }, { "$set": project })
        .then(result => {
            const resultProject = replaceId(project);
            if (result.result.ok && result.modifiedCount === 1) {
                res.json({ data: resultProject });
            } else {
                error(req, res, 400, `Data was NOT modified in database: ${JSON.stringify(project)}`);
            }
        }).catch((err) => {
            error(req, res, 500, `Server error: ${err}`, err);
        })
    // }).catch(errors => {
    //     error(req, res, 400, `Invalid project data: ${util.inspect(errors)}`);
});

// DELETE project list
router.delete('/:projectId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.db('login').collection('projects').findOneAndDelete({ _id: new mongodb.ObjectID(params.projectId) },
        function (err, result) {
            if (err) throw err;
            if (result.ok) {
                replaceId(result.value);
                res.json({ data: result.value });
            } else {
                error(req, res, 404, `Project with Id=${params.projectId} not found.`, err);
            }
        });
});

// // DELETE comments
// router.delete('/:projectId/comments', function (req, res) {
//     const db = req.app.locals.db;
//     const params = req.params;
//     db.db('login').collection('comments').findOneAndDelete({ _id: new mongodb.ObjectID(params.projectId) },
//         function (err, result) {
//             if (err) throw err;
//             if (result.ok) {
//                 replaceId(result.value);
//                 res.json({ data: result.value });
//             } else {
//                 error(req, res, 404, `Project with Id=${params.projectId} not found.`, err);
//             }
//         });
// });

module.exports = router;
