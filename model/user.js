const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: '1234678',
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    access: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('users', userSchema);
