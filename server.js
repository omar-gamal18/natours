const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const AppError = require('./utils/appError');
const ErrorHandling = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');

dotenv.config({ path: './config.env' });
const app = express();
app.use(express.json());

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
app.use('/api/v1/tours', tourRoutes);

// Handling Unhandled Routes
// old V
// app.all('*', (req, res, next) => {
//   //   res.status(404).json({
//   //     status: "fail",
//   //     message: `can't find ${req.originalUrl} on this server`,
//   //   });
//   const error = new Error(`can't find ${req.originalUrl} on this server`);
//   error.status = 'fail';
//   error.statusCode = 404;

//   next(error); // this step will automatically skip all other midllewares and go to Error Handling Middleware
// });

// NEW V

app.all('*path', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404)); // this step will automatically skip all other midllewares and go to Error Handling Middleware
});

// Error Handling Middleware
app.use(ErrorHandling);

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
