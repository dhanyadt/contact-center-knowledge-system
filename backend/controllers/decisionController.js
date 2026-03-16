const mongoose = require("mongoose");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

exports.getFirstQuestion = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.json({ error: "Invalid category ID" });
    }

    const question = await Question.findOne({ category_id: categoryId });

    if (!question) {
      return res.json({ error: "No questions found" });
    }

    const answers = await Answer.find({ question_id: question._id });

    res.json({
      question: {
        id: question._id,
        text: question.text
      },
      answers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNextQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    const answers = await Answer.find({ question_id: questionId });

    res.json({
      question: {
        id: question._id,
        text: question.text
      },
      answers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};