const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tours = require('../../models/tourModel');
const Tour = require('../../models/tourModel');

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

const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf8'));

const insertData = async () => {
  try {
    await Tour.create(tours);
    console.log('data added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') insertData();
if (process.argv[2] === '--delete') deleteData();
