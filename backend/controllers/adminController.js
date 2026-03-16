const Knowledge = require("../models/Knowledge");
const Category  = require("../models/Category");
const Question  = require("../models/Question");
const Answer    = require("../models/Answer");

// ─────────────────────────────────────────────
// KNOWLEDGE BASE
// ─────────────────────────────────────────────

exports.addKnowledge = async (req, res) => {
  try {
    const { category, question, answer } = req.body;
    const entry = await Knowledge.create({ category, question, answer });
    res.json({ message: "Knowledge entry added", data: entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKnowledge = async (req, res) => {
  try {
    const data = await Knowledge.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer } = req.body;
    const updated = await Knowledge.findByIdAndUpdate(
      id,
      { category, question, answer },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Entry not found" });
    res.json({ message: "Knowledge entry updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    await Knowledge.findByIdAndDelete(id);
    res.json({ message: "Knowledge entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

exports.adminGetCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminCreateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Category name is required" });
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ error: "A category with that name already exists" });
    const category = await Category.create({ name: name.trim() });
    res.json({ message: "Category created", data: category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Category name is required" });
    const updated = await Category.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Cascade delete questions and answers for this category
    const questions = await Question.find({ category_id: id });
    const questionIds = questions.map(q => q._id);
    await Answer.deleteMany({ question_id: { $in: questionIds } });
    await Question.deleteMany({ category_id: id });
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category and all related questions/answers deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────

exports.adminGetQuestions = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const questions = await Question.find({ category_id: categoryId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminCreateQuestion = async (req, res) => {
  try {
    const { text, category_id } = req.body;
    if (!text || !category_id) return res.status(400).json({ error: "text and category_id are required" });
    const question = await Question.create({ text, category_id });
    res.json({ message: "Question created", data: question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminUpdateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const updated = await Question.findByIdAndUpdate(id, { text }, { new: true });
    if (!updated) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminDeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Answer.deleteMany({ question_id: id });
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question and its answers deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ANSWERS
// ─────────────────────────────────────────────

exports.adminGetAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ question_id: questionId });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminCreateAnswer = async (req, res) => {
  try {
    const { answer_text, question_id, next_question_id, solution_text } = req.body;
    if (!answer_text || !question_id) return res.status(400).json({ error: "answer_text and question_id are required" });
    const answer = await Answer.create({
      answer_text,
      question_id,
      next_question_id: next_question_id || null,
      solution_text: solution_text || null
    });
    res.json({ message: "Answer created", data: answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminUpdateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer_text, next_question_id, solution_text } = req.body;
    const updated = await Answer.findByIdAndUpdate(
      id,
      { answer_text, next_question_id: next_question_id || null, solution_text: solution_text || null },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Answer not found" });
    res.json({ message: "Answer updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminDeleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    await Answer.findByIdAndDelete(id);
    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// STATS (dashboard summary)
// ─────────────────────────────────────────────

exports.adminGetStats = async (req, res) => {
  try {
    const [categories, questions, answers, knowledge] = await Promise.all([
      Category.countDocuments(),
      Question.countDocuments(),
      Answer.countDocuments(),
      Knowledge.countDocuments()
    ]);
    res.json({ categories, questions, answers, knowledge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};