const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: '../../config.env' });
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.log('DB connection failed:', err);
  });

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf8'));

const insertData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('data added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') insertData();
if (process.argv[2] === '--delete') deleteData();
