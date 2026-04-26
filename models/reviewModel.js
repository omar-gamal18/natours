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

//IMPORTNAT NOTE => Use this.model.findOne(this.getFilter()) when you only need the document — not the entire query behavior.

// In query middleware (like findOneAndUpdate / findOneAndDelete),
// `this` refers to the query object, NOT the actual document.
// We need access to the document being modified in order to recalculate
// the average ratings after the operation.

// ❌ Wrong approach:
// Using `this.findOne()` directly executes the same query instance,
// which can lead to unexpected behavior or query re-execution issues.
// reviewSchema.pre(/^findOneAnd/, async function () {
//
//   const r = await this.findOne(); // 💥 Query was already executed error
//  Mongoose throws Query was already executed because you're trying to run the same query object twice.
// });

// ✅ Correct approach:
//    - Creates a fresh, clean query using only the filter conditions.
//    - Avoids copying unnecessary options.
//    - More explicit and predictable.
reviewSchema.pre(/^findOneAnd/, async function () {
  this.r = await this.model.findOne(this.getFilter());
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
