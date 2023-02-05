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

// GET create new brand form page
router.get('/create/brand', brandController.create_brand_form);

// POST new brand
router.post('/create/brand', brandController.brand_create_post);

/* CAR TYPE ROUTES */

// GET all car types
router.get('/cartypes', carTypeController.cartypes_list);

// GET car type details
router.get('/cartype/:id', carTypeController.cartype_details);

// GET create new car type form page
router.get('/create/cartype', carTypeController.cartype_create_get);

module.exports = router;
