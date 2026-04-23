const express = require('express');

const tourController = require('../controllers/tourController.js');
const authController = require('../controllers/authController.js');
const reviewController = require('../controllers/reviewController.js');

const router = express.Router();

router.route('/top-5').get(tourController.getTop5, tourController.getAllTours);
router.route('/agg').get(tourController.getToursStatus);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

module.exports = router;
