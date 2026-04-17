const User = require('../models/userModel');
const AppError = require('../utils/appError');

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
