const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');

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
  let token;
  if (
    req.headrs.authorization &&
    req.headrs.authorization.startsWith('Bearer')
  ) {
    token = req.headrs.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!,login first to get access', 401),
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: 'User no longer exists',
    });
  }

  // 5) attach user to request
  req.user = currentUser;

  next();
};
