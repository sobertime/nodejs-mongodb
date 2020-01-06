const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const CommantaireSchema = new mongoose.Schema({
  id:{
    type: Number
  },
  id_billet : {
    type: String
  },
  post_by :{
    type : String
  },
  commantaire :{
    type : String
  }
});
CommantaireSchema.plugin(autoIncrement,{inc_field: 'id_comm'});
const Commantaire = mongoose.model('Commantaire',CommantaireSchema);
module.exports = Commantaire;
