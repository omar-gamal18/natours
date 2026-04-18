const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { decode } = require('punycode');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('pls provide the email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
};

exports.protect = async (req, res, next) => {
  // 1. Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check token exists
  if (!token) {
    return next(
      new AppError('You are not logged in!,login first to get access', 401),
    );
  }
  // 3. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 4. Check user still exists
  const cuurentUser = await User.findById(decoded.id);
  if (!cuurentUser) return next(new AppError('User no longer exists', 401));

  // 5. Check if password changed after token was issued
  if (cuurentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password changed! Please log in again.', 401));
  }
  next();
};
