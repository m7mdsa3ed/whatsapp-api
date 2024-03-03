const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  quote: String,
  author: String,
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

module.exports = mongoose.model("Message", schema, "messages");
