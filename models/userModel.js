const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the name is required'],
    },
    email: {
      type: String,
      required: [true, 'the name is required'],
      unique: [true, 'pls enater another email'],
      lowercase: true,
      validate: [validator.isEmail, 'pls enter valid email'],
    },
    photo: String,
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    confirmpassword: {
      type: String,
      minlength: 8,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: 'pls enter the same password',
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  // isModified => check if the field is updated and when we create a new user
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
