const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

/* GET home page. */
router.get('/', carController.index);

// GET all cars page
router.get('/cars', carController.cars_list);

// GET all cars page
router.get('/car/:id', carController.car_details);

module.exports = router;
