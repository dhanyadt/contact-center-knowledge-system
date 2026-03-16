const express = require("express");
const router  = express.Router();

const {
  addKnowledge, getKnowledge, updateKnowledge, deleteKnowledge,
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminGetQuestions, adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion,
  adminGetAnswers, adminCreateAnswer, adminUpdateAnswer, adminDeleteAnswer,
  adminGetStats
} = require("../controllers/adminController");

const { getContacts, updateContactStatus } = require("../controllers/contactController");

// Stats
router.get("/stats", adminGetStats);

// Knowledge base
router.get("/knowledge",        getKnowledge);
router.post("/knowledge",       addKnowledge);
router.put("/knowledge/:id",    updateKnowledge);
router.delete("/knowledge/:id", deleteKnowledge);

// Categories
router.get("/categories",        adminGetCategories);
router.post("/categories",       adminCreateCategory);
router.put("/categories/:id",    adminUpdateCategory);
router.delete("/categories/:id", adminDeleteCategory);

// Questions
router.get("/categories/:categoryId/questions", adminGetQuestions);
router.post("/questions",                        adminCreateQuestion);
router.put("/questions/:id",                     adminUpdateQuestion);
router.delete("/questions/:id",                  adminDeleteQuestion);

// Answers
router.get("/questions/:questionId/answers", adminGetAnswers);
router.post("/answers",                       adminCreateAnswer);
router.put("/answers/:id",                    adminUpdateAnswer);
router.delete("/answers/:id",                 adminDeleteAnswer);

// Contacts (from contact form)
router.get("/contacts",              getContacts);
router.put("/contacts/:id/status",   updateContactStatus);

module.exports = router;