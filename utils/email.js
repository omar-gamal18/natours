const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      pass: '0f2256735f3621',
    },
    logger: true,
    debug: true,
  });

  const mailOptions = {
    from: 'omar gamal <omar.gamal18200588@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: 'sandbox.smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//       user: '676aed71c5997c',
//       pass: '****3621',
//     },
//     logger: true,
//     debug: true,
//   });

//   const mailOptions = {
//     from: 'omar gamal <omar.gamal18200588@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
