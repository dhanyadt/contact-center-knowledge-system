const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

module.exports = mongoose.model("Question", questionSchema);