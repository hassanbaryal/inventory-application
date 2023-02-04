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
