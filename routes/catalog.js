const express = require('express');
const carController = require('../controllers/carController');
const carInstanceController = require('../controllers/carInstanceController');
const brandController = require('../controllers/brandController');
const carTypeController = require('../controllers/carTypeController');

const router = express.Router();

/* GET home page. */
router.get('/', carController.index);

/* CAR ROUTES */

// GET all cars page
router.get('/cars', carController.cars_list);

// GET car detail page
router.get('/car/:id', carController.car_details);

// GET new car form
router.get('/create/car', carController.create_car_get);

// POST new car
router.post('/create/car', carController.create_car_post);

/* CAR INSTANCE ROUTES */

// GET car instance detail page
router.get('/carinstance/:id', carInstanceController.carinstance_details);

router.get('/create/carinstance', carInstanceController.create_carinstance_form)


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

// POST new car type
router.post('/create/cartype', carTypeController.cartype_create_post);

module.exports = router;
