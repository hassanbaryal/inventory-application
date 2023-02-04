const express = require('express');
const carController = require('../controllers/carController');
const carInstanceController = require('../controllers/carInstanceController');
const brandController = require('../controllers/brandController');
const carTypeController = require('../controllers/carTypeController');

const router = express.Router();

/* GET home page. */
router.get('/', carController.index);

// GET all cars page
router.get('/cars', carController.cars_list);

// GET car detail page
router.get('/car/:id', carController.car_details);

/* CAR INSTANCE ROUTES */

// GET car instance detail page
router.get('/carinstance/:id', carInstanceController.carinstance_details);

/* BRAND ROUTES */

// GET all brands page
router.get('/brands', brandController.all_brands);

// GET brand details page
router.get('/brand/:id', brandController.brand_details);

/* CAR TYPE ROUTES */

// GET all car types
router.get('/cartypes', carTypeController.cartypes_list);

module.exports = router;
