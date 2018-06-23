var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var bcrypt = require("bcrypt");

// Hide the password by default
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        // unique: true,
        // required: true
    },
    username: String,
    password: {
        type: String,
        // select : false
    }
});
//   hash: String,
//   salt: String
// });


// // never save the password in plaintext, always a hash of it
// UserSchema.pre("save", function(next) {
//   var user = this;

//   if (!user.isModified("password")) {
//       return next();
//   }

//   // use bcrypt to generate a salt
//   bcrypt.genSalt(10, function(err, salt) {
//       if (err) {
//           return next(err);
//       }
//       // using the generated salt, use bcrypt to generate a hash of the password
//       bcrypt.hash(user.password, salt, function(err, hash) {
//           if (err) {
//               return next(err);
//           }
//           // store the password hash as the password
//           user.password = hash; //да се пренапише без Mongoose
//           next();
//       });
//   });
// });

// UserSchema.methods.isPasswordValid = function(rawPassword, callback) {
//   bcrypt.compare(rawPassword, this.password, function(err, same) {
//       if (err) {
//           callback(err);
//       }
//       callback(null, same);
//   });
// };


UserSchema.methods.isPasswordValid = function (rawPassword) {
    return bcrypt.compare(rawPassword, this.password)
};

UserSchema.methods.setPassword = function (password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    this.password = hash;
};

// userSchema.methods.generateJwt = function() {
//   var expiry = new Date();
//   expiry.setDate(expiry.getDate() + 7);

//   return jwt.sign({
//     _id: this._id,
//     email: this.email,
//     name: this.name,
//     exp: parseInt(expiry.getTime() / 1000),
//   }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
// };

mongoose.model('User', UserSchema);
