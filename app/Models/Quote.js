const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  quote: String,
  author: String,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

module.exports = mongoose.model("Quote", schema);
