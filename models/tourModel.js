const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('./userModel');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the name is required'],
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 40,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'the durations is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'the group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'the difficulty is required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating Must Be Above 1.0'],
      max: [5, 'Rating Must Be Below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'the price is required'],
    },
    priceDiscount: {
      type: Number,
      // custom validator
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'the description is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'the image is required'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // Embedded / Denormalized
    // to do it use array
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    // guides: Array, old V
    // Child Referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId, // this means we will get only the id
        ref: 'User', // referes to the model
      },
    ],
    // instead of doing that we will use virtual populate
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ startLocation: '2dsphere' });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('weeks').get(function () {
  return this.duration / 7;
});

// virtual populate to access reviews
tourSchema.virtual('reviews', {
  ref: 'Review', // which model to reference
  foreignField: 'tour', // in Review, the field pointing to Tour
  localField: '_id', // in Tour, match against this
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

// tourSchema.pre('save', async function () {
//   this.guides = await Promise.all(this.guides.map((id) => User.findById(id)));
// });

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.pre(/^find/, function () {
  this.populate({
    path: 'guides',
    select: 'name email role',
  });
});

tourSchema.post(/^find/, function (docs) {
  console.log(`TIME TOOK ${Date.now() - this.start} millisecondes`);
  // console.log(docs);
});

// tourSchema.pre('aggregate', function () {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
