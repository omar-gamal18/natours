const express = require('express');

const reviewRoutes = require('./reviewRoutes.js');
const tourController = require('../controllers/tourController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.use('/:tourId/reviews', reviewRoutes);

router.route('/top-5').get(tourController.getTop5, tourController.getAllTours);
router.route('/agg').get(tourController.getToursStatus);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
