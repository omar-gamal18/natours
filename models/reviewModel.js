const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
