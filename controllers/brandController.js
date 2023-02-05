const async = require('async');
const { body, validationResult } = require('express-validator');
const Brand = require('../models/brand');
const Car = require('../models/car');

// Display all brands
exports.all_brands = (req, res, next) => {
  Brand.find()
    .sort({ name: 1 })
    .exec((err, list) => {
      if (err) {
        return next(err);
      }

      return res.render('brands', {
        title: 'All Brands',
        list_brands: list,
      });
    });
};

// Display brand details on GET
exports.brand_details = (req, res, next) => {
  async.parallel(
    {
      brand(cb) {
        Brand.findById(req.params.id).exec(cb);
      },
      associated_cars(cb) {
        Car.find({ brand: req.params.id }).sort({ name: 1 }).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.brand === null) {
        const newErr = new Error('Brand not found!');
        newErr.status = 404;
        return next(newErr);
      }

      return res.render('brand_details', {
        title: `${results.brand.name} Details`,
        brand: results.brand,
        associated_cars: results.associated_cars,
      });
    }
  );
};

// Display new brand form on GET
exports.create_brand_form = (req, res) => {
  res.render('brand_form', {
    title: 'Create Brand',
    brand: null,
    errors: null,
  });
};

// Create new brand on POST
exports.brand_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Brand name required (max 100 characters)'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage('Brand description required (max 1000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render form again with sanitized values and error messages
      return res.render('brand_form', {
        title: 'Create Brand',
        brand: req.body,
        errors: errors.array(),
      });
    }
    // No errors, create new brand document
    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
    });
    // Save document to database
    return brand.save((err) => {
      if (err) return next(err);
      // Redirect user to new brand detail page
      return res.redirect(brand.url);
    });
  },
];
