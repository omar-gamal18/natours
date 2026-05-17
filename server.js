process.on('uncaughtException', (err) => {
  console.error('UNHANDLED Exception 💥', err);
  console.log(err.name, err.message);
  process.exit(1);
});

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'config.env') });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  encodeURIComponent(process.env.DATABASE_PASSWORD),
);

mongoose.connect(DB).then(() => {
  console.log('DB connected successfully');
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
