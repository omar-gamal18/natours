const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
};

exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('no review found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
};

exports.createReview = async (req, res, next) => {
  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: req.body.user,
    tour: req.body.tour,
  });
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
};
