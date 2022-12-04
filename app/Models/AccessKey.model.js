const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  key: String,
  isActive: Boolean,
});

module.exports = mongoose.model("AccessKey", schema);
