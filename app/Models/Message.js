const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  type: String,
  body: JSON,
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

module.exports = mongoose.model("Message", schema);
