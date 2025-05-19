const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', NewsSchema);
