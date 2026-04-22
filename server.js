const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const ErrorHandling = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: './config.env' });
const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, try again in one hour',
});
app.use('/api', limiter);

// body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// HTTP Parameter Pollution Prevention
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

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
app.use('/api/v1/users', userRoutes);

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

// const { MailtrapClient } = require('mailtrap');

// const TOKEN = 'e663511790e68a8a15fdd18766a496c5';

// const client = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: 'hello@demomailtrap.co',
//   name: 'Mailtrap Test',
// };
// const recipients = [
//   {
//     email: 'omar.gamal18200588@gmail.com',
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: 'You are awesome!',
//     text: 'Congrats for sending test email with Mailtrap!',
//     category: 'Integration Test',
//   })
//   .then(console.log, console.error);
