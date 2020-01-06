const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const BoutiqueSchema = new mongoose.Schema({
  id: {
    type : Number
  },
  titre: {
    type: String,
    required: true
  },
  prix: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  category:{
    type : String
  }
});
BoutiqueSchema.plugin(autoIncrement,{inc_field: 'id_product'});
const Boutique = mongoose.model('Boutique',BoutiqueSchema);
module.exports = Boutique;
