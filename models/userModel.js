const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the name is required'],
    },
    email: {
      type: String,
      required: [true, 'the name is required'],
      unique: [true, 'pls enate anothe email'],
      lowercase: true,
      validate: [validator.isEmail, 'pls enter valid email'],
    },
    photo: String,
    password: {
      type: String,
      minlength: 8,
    },
    confirmpassword: {
      type: String,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
