const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;



const promotionSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  image: {
    type: String,
    require:true
  },
  featured: {
    type: Boolean,
    default: true
  },
  cost: {
    type: Number,
    require: true,
    min: 0
  },
  description: {
    type: String,
    require: true
  }
},{
  timestamps: true
});


const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;