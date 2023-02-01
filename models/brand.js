const mongoose = require('mongoose');

const { Schema } = mongoose;

const brandSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, minLength: 3, maxLength: 250 },
});

brandSchema.virtual('url').get(function () {
  return `/catalog/brand/${this._id}`;
});

module.exports = mongoose.model('Brand', brandSchema);
