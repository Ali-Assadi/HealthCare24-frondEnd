const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ New fields
  age: { type: Number, required: false },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  details: { type: String, required: false },
  mustUpdatePassword: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
