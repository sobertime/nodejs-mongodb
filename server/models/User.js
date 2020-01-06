const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const UserSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  login: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean
  }
});
UserSchema.plugin(autoIncrement,{inc_field: 'id'});
const User = mongoose.model('User', UserSchema);
module.exports = User;
