const CarType = require('../models/carType');

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
