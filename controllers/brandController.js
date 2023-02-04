const Brand = require('../models/brand');

// Display all brands
exports.all_brands = (req, res, next) => {
  Brand.find().exec((err, list) => {
    if (err) {
      return next(err);
    }

    return res.render('brands', {
      title: 'All Brands',
      list_brands: list,
    });
  });
};
