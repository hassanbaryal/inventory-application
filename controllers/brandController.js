const async = require('async');
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

exports.create_brand_form = (req, res) => {
  res.render('brand_form', {
    title: 'Create Brand',
  });
};
