const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Knowledge", knowledgeSchema);