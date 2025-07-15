// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  shared: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('File', fileSchema);
