const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
};

exports.createReview = async (req, res, next) => {
  // move it to it's own function
  //   if (!req.body.tour) req.body.tour = req.params.tourId;
  //   if (!req.body.user) req.body.user = req.user.id;
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
