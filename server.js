const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const tourRoutes = require('./routes/tourRoutes');

dotenv.config({ path: './config.env' });
const app = express();
app.use(express.json());

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
app.use('/api/v1/tours', tourRoutes);

const port = process.env.PORT;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connected successfully');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('DB connection failed:', err);
  });
