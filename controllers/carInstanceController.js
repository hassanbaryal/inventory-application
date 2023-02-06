const async = require('async');
const carInstance = require('../models/carInstance');
const Car = require('../models/car');

// Display car instance details on GET
exports.carinstance_details = (req, res, next) => {
  carInstance
    .findById(req.params.id)
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
        title: 'Create new car',
        carinstance: null,
        cars: results.cars,
        errors: null,
      });
    }
  );
};
