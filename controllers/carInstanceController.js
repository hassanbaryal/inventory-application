const async = require('async');
const { body, validationResult } = require('express-validator');
const CarInstance = require('../models/carInstance');
const Car = require('../models/car');

// Display car instance details on GET
exports.carinstance_details = (req, res, next) => {
  CarInstance.findById(req.params.id)
    .populate('car')
    .exec((err, car_instance) => {
      if (err) {
        return next(err);
      }

      return res.render('carinstance_details', {
        title: `Unit ${car_instance._id}`,
        car_instance,
      });
    });
};

// Display create car instance form on GET
exports.create_carinstance_form = (req, res, next) => {
  async.series(
    {
      cars(cb) {
        Car.find({}, 'name').sort({ name: 1 }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      return res.render('carinstance_form', {
        title: 'Create new car instance',
        carinstance: null,
        cars: results.cars,
        errors: null,
      });
    }
  );
};

// Create new car instance on POST
exports.create_carinstance_post = [
  body('car')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Car name required'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage('Description required (max 1000 characters)'),
  body('price')
    .trim()
    .isNumeric()
    .escape()
    .withMessage('Price required (no commas, decimals, etc.)'),
  body('condition')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Condition required'),
  body('year')
    .trim()
    .isFloat({ min: 1886 })
    .escape()
    .withMessage('Year required (minimum 1886)'),
  (req, res, next) => {
    async.series(
      {
        cars(cb) {
          Car.find({}, 'name').sort({ name: 1 }).exec(cb);
        },
      },
      (err, results) => {
        if (err) next(err);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          // There are errors, render form again with sanitized values and error messages
          return res.render('carinstance_form', {
            title: 'Create new car instance',
            carinstance: req.body,
            cars: results.cars,
            errors: errors.array(),
          });
        }

        const carinstance = new CarInstance({
          car: req.body.car,
          description: req.body.description,
          price: req.body.price,
          condition: req.body.condition,
          year: req.body.year,
        });

        carinstance.save((error) => {
          if (error) return next(error);
          return res.redirect(carinstance.url);
        });
      }
    );
  },
];
