const mongoose = require('mongoose');
const cvdiSchema = new mongoose.Schema(
  {
    stt: {
      type: Number,
      require: true,
    },
    sovb: {
      type: Number,
      require: true,
    },
    loaivb: {
      type: Number,
      require: true,
    },
    ngaythang: {
      type: Date,
      require: true,
    },
    noidungvb: {
      type: String,
      require: true,
    },
    nguoithuchien: {
      type: Array,
      require: true,
    },
    nguoinhan: {
      type: Array,
      require: true,
    },
    tacgia: {
      type: String,
      require: true,
    },
    filepatch: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('cvdi', cvdiSchema);
