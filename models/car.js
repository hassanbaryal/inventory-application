const mongoose = require('mongoose');

const { Schema } = mongoose;

const carSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 100 },
  description: { type: String, required: true, minLength: 3, maxLength: 1000 },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  carType: { type: Schema.Types.ObjectId, ref: 'CarType' }
});

carSchema.virtual('url').get(function () {
  return `/catalog/brand/${this._id}`;
});

module.exports = mongoose.model('Car', carSchema);
