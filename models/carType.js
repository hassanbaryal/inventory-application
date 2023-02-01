const mongoose = require('mongoose');

const { Schema } = mongoose;

const carTypeSchema = new Schema({
  name: { type: String, required: true, minLength: 1 }
});

carTypeSchema.virtual('url').get(function () {
  return `/catalog/cartype/${this._id}`;
});

module.exports = mongoose.model('CarType', carTypeSchema);
