const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: 'string',
      required: [true, 'Review can not be an empty '],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Parent Referencing
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour. '],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user. '],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ rating: -1 });

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  //   .populate({
  //         path: 'tour',
  //     select: 'name',
  //   })
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  // this points to the current model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0]?.nRating ?? 0,
    ratingsAverage: stats[0]?.avgRating ?? 4.5,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
