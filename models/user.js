const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: [true, "min 8 characters"]
  }
});

//pre middleware to encrypt before saving. Don't use arrow function because it binds the global this to this function, which is currently undefined. userSchema creates an instance of the user, and binds the username and password to this function. On line 23, arrow function is used because it binds the password that is within the function on line 18.
userSchema.pre("save", function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      return next();
    })
    .catch(err => {
      return next(err);
    });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
