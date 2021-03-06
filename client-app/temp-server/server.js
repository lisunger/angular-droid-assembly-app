const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const RSA_PRIVATE_KEY = fs.readFileSync('./private.key');

const app = express();
app.use(bodyParser.json());
// app.use(cookieParser);

app.listen(8000, () => {
  console.log('Server started!');
});

app.route('/server/login').post((req, resp) => {
  console.log('Request for me!');
  console.log(req.body);

  if (req.body['email'] === 'niki' && req.body['password'] === '123') {
    // var time = (new Date()).getTime() + 604800000;
    let minutes = 60 * 60 * 24;

    const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: minutes,
      subject: 'myUsernameFromDb'
    });

    resp.status(200).send({
      idToken: jwtBearerToken,
      expiresIn: minutes,
      userId: req.body['email'] // username from db
    });
  } else {
    resp.status(401).send('wrong email or password');
  }
});

app.route('/test').get((req, resp) => {
  setTimeout(() => {
    resp.send({ niki: 94, pass: 'qwe' });
  }, 3000);
});
