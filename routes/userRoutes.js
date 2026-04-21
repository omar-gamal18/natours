const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  max: 5,
  windowMs: 30 * 60 * 1000,
  message: 'TOO many attempts, pls try again after 30 minutes',
});

router.post('/signup', authLimiter, authController.signUp);
router.post('/login', authLimiter, authController.login);
router.post('/forgotPassword', authLimiter, authController.forgotPassword);
router.patch(
  '/resetPassword/:token',
  authLimiter,
  authController.resetPassword,
);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
