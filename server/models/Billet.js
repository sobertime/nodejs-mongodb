const mongoose = require('mongoose');
const BilletSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    require: true
  }
});
const Billet = mongoose.model('Billet',BilletSchema);
module.exports = Billet;
