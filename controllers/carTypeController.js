const { body, validationResult } = require('express-validator');
const async = require('async');
const CarType = require('../models/carType');
const Car = require('../models/car');

// Display all car types
exports.cartypes_list = (req, res, next) => {
  CarType.find()
    .sort({ name: 1 })
    .exec((err, list) => {
      if (err) {
        return next(err);
      }

      return res.render('cartypes', {
        title: 'Car Types',
        cartypes: list,
      });
    });
};

// Display car type details
exports.cartype_details = (req, res, next) => {
  async.parallel(
    {
      cartype(cb) {
        CarType.findById(req.params.id).exec(cb);
      },
      associated_cars(cb) {
        Car.find({ carType: req.params.id }, 'name').sort({ name: 1 }).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.cartype === null) {
        const newErr = new Error('Car type not found');
        newErr.status = 404;
        return next(err);
      }

      return res.render('cartype_details', {
        title: `${results.cartype.name}'s`,
        associated_cars: results.associated_cars,
      });
    }
  );
};

// Display cartype form on GET
exports.cartype_create_get = (req, res) => {
  res.render('cartype_form', {
    title: 'Create Car Type',
    cartype: null,
    errors: null,
  });
};

// Create new car type on POST
exports.cartype_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Car Type Name required'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('cartype_form', {
        title: 'Create Car Type',
        cartype: req.body,
        errors: errors.array(),
      });
    }

    async.series(
      {
        duplicates(cb) {
          CarType.find({ name: req.body.name }).exec(cb);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }

        if (results.duplicates.length > 0) {
          res.render('cartype_form', {
            title: 'Create Car Type',
            cartype: req.body,
            errors: [{ msg: 'Car type already exists!' }],
          });
        } else {
          const carType = new CarType({
            name: req.body.name,
          });

          carType.save((error) => {
            if (error) return next(error);
            return res.redirect(carType.url);
          });
        }
        return null;
      }
    );
  },
];
