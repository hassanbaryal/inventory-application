const carInstance = require('../models/carInstance');

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
