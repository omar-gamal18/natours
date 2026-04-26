const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// OLD VERSIONS IN THE BOTTOM OF THE FILE
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTop5 = (req, res, next) => {
  Object.assign(req.query, {
    limit: '5',
    sort: '-ratingAverage,price',
    fields: 'name,price,ratingAverage,summary',
  });
  next();
};

exports.getToursStatus = async (req, res, next) => {
  const stat = await Tour.aggregate([
    {
      $match: { price: { $gte: 1000 } },
    },
    {
      $group: {
        _id: '$difficulty', // _id means this is the key will be filterd used it if we want all docs in one group use: null
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: stat,
  });
};

exports.getMonthlyPlan = async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    // {
    //   $unset: '_id',
    // },
    {
      $project: { _id: 0 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
};

// old Versions => just a refernce(:
// exports.getTour = async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError('failed to found tour with this id', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };
// exports.getAllTours = async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .selectFields()
//     .pagination();

//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };
// exports.createTour = async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// exports.updateTour = async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     returnDocument: 'after',
//     // new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('failed to found tour with this id', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };
// exports.deleteTour = async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('failed to found tour with this id', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
