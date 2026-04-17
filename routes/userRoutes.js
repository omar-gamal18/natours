const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router
  .route('/')
  .get(userController.getAllTours)
  .post(userController.createTour);
router
  .route('/:id')
  .get(userController.getTour)
  .patch(userController.updateTour)
  .delete(userController.deleteTour);

module.exports = router;
