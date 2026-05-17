const Tour = require('../models/tourModel');

exports.getOverview = async (req, res, next) => {
  try {
    const tours = await Tour.find();

    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  } catch (err) {
    next(err); // passes to your ErrorHandling middleware
  }
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
