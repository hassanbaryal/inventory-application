const mongoose = require('mongoose');

const { Schema } = mongoose;

const carInstanceSchema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  description: { type: String, maxLength: 250 },
  price: { type: Number, required: true, min: 0 },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Used'],
    default: 'New',
  },
  year: { type: Number, required: true, min: 1886 },
});

carInstanceSchema.virtual('url').get(function () {
  return `/catalog/carinstance/${this._id}`;
});

module.exports = mongoose.model('CarInstance', carInstanceSchema);
