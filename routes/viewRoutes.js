const express = require('express');

const viewController = require('../controllers/viewController');

const router = express.Router();

app.get('/', viewController.getOverview);
app.get('/tour', viewController.getTour);

module.exports = router;
