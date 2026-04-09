const mongoose = require('mongoose');
const slugify = require('slugify');

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
        values: ['easy', 'medium', 'difficulty'],
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
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
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('weeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.post(/^find/, function (docs) {
  console.log(`TIME TOOK ${Date.now() - this.start} millisecondes`);
  console.log(docs);
});

tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
