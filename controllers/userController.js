const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  //1) check if user trying to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('Invalid route pls use updatePassword route', 400),
    );
  }
  const filtered = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filtered, {
    returnDocument: 'after',
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('failed to found user with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
exports.createUser = async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};
exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    // new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('failed to found user with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('failed to found user with this id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};
