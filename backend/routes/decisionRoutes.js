const express = require("express");
const router = express.Router();

const {
  getFirstQuestion,
  getNextQuestion
} = require("../controllers/decisionController");

router.get("/category/:id/json", getFirstQuestion);

router.get("/question/:id/json", getNextQuestion);

module.exports = router;