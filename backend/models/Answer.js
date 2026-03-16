const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answer_text: String,

  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },

  next_question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },

  solution_text: String
});

module.exports = mongoose.model("Answer", answerSchema);