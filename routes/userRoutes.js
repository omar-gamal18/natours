const express = require('express');
const rateLimit = require('express-rate-limit');

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

// to use the protect midlleware on all routes after this line
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
