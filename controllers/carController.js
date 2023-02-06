const async = require('async');
const { body, validationResult } = require('express-validator');
const Car = require('../models/car');
const Brand = require('../models/brand');
const CarInstance = require('../models/carInstance');
const CarType = require('../models/carType');

// Display home page
exports.index = (req, res, next) => {
  async.parallel(
    {
      car_count(cb) {
        Car.countDocuments({}, cb);
      },
      brand_count(cb) {
        Brand.countDocuments({}, cb);
      },
      carinstance_count(cb) {
        CarInstance.countDocuments({}, cb);
      },
      cartype_count(cb) {
        CarType.countDocuments({}, cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      return res.render('index', {
        title: 'Inventory Management App (Cars)',
        car_count: results.car_count,
        brand_count: results.brand_count,
        carinstance_count: results.carinstance_count,
        cartype_count: results.cartype_count,
      });
    }
  );
};

// Display all cars
exports.cars_list = (req, res, next) => {
  Car.find({}, { name: 1 })
    .sort({ name: 1 })
    .exec((err, list) => {
      if (err) {
        return next(err);
      }
      return res.render('cars', {
        title: 'All cars',
        car_list: list,
      });
    });
};

// Display car details
exports.car_details = (req, res, next) => {
  async.parallel(
    {
      car(cb) {
        Car.findById(req.params.id).populate(['brand', 'carType']).exec(cb);
      },
      car_instances(cb) {
        CarInstance.find({ car: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.car === null) {
        const newErr = new Error('Book not found');
        newErr.status = 404;
        return next(err);
      }

      return res.render('car_details', {
        title: results.car.name,
        car_details: results.car,
        car_instances: results.car_instances,
      });
    }
  );
};

// Display new car form
exports.create_car_get = (req, res, next) => {
  async.parallel(
    {
      brands(cb) {
        Brand.find({}, 'name').sort({ name: 1 }).exec(cb);
      },
      cartypes(cb) {
        CarType.find({}, 'name').sort({ name: 1 }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      return res.render('car_form', {
        title: 'Create new car',
        car: null,
        brands: results.brands,
        cartypes: results.cartypes,
        errors: null,
      });
    }
  );
};

// POST new car
exports.create_car_post = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Car name required'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage('Car description required'),
  body('brand')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Brand required'),
  body('cartype')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Car type required'),
  (req, res, next) => {
    async.parallel(
      {
        brands(cb) {
          Brand.find({}, 'name').sort({ name: 1 }).exec(cb);
        },
        cartypes(cb) {
          CarType.find({}, 'name').sort({ name: 1 }).exec(cb);
        },
        duplicates(cb) {
          Car.find({ name: req.body.name }).exec(cb);
        },
      },
      (err, results) => {
        if (err) return next(err);

        const errors = validationResult(req);
        console.log('DESCRIPTION', req.body.description);
        if (!errors.isEmpty()) {
          // There are errors, render form again with sanitized values and error messages
          return res.render('car_form', {
            title: 'Create new car',
            car: req.body,
            brands: results.brands,
            cartypes: results.cartypes,
            errors: errors.array(),
          });
        }

        if (results.duplicates.length > 0) {
          return res.render('car_form', {
            title: 'Create new car',
            car: req.body,
            brands: results.brands,
            cartypes: results.cartypes,
            errors: [{ msg: 'Car already exists!' }],
          });
        }

        // No errors, create new brand document
        const car = new Car({
          name: req.body.name,
          description: req.body.description,
          brand: req.body.brand,
          carType: req.body.cartype,
        });
        // Save document to database
        return car.save((error) => {
          if (error) return next(error);
          // Redirect user to new brand detail page
          return res.redirect(car.url);
        });
      }
    );
  },
];
