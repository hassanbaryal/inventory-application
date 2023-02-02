const async = require('async');
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
  Car.find()
    .sort({ name: 1 })
    .populate(['brand', 'carType'])
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
  res.render('NOT IMPLEMENTED: ', {
    title: 'Car Details',
  });
};

// Display new car form
exports.create_car = (req, res, next) => {
  res.render('NOT IMPLEMENTED: new_car_form', {
    title: 'Create new car',
  });
};
