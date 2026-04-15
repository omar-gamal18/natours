const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const AppError = require('./utils/appError');
const ErrorHandling = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');

dotenv.config({ path: './config.env' });
const app = express();
app.use(express.json());

process.on('uncaughtException', (err) => {
  console.error('UNHANDLED Exception 💥', err);
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
app.use('/api/v1/tours', tourRoutes);

app.all('*path', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404)); // this step will automatically skip all other midllewares and go to Error Handling Middleware
});

// Error Handling Middleware
app.use(ErrorHandling);

const port = process.env.PORT;

mongoose.connect(DB).then(() => {
  console.log('DB connected successfully');
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close((_) => {
    process.exit(1);
  });
});
