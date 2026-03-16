const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { loadModel, findBestMatch } = require("../utils/semanticSearch");

loadModel();

let knowledgeBase = [];

// Load CSV knowledge base when server starts
const loadKB = () => {

  const filePath = path.join(__dirname, "../ai_kb/kb_texts.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      knowledgeBase.push(row);
    })
    .on("end", () => {
      console.log("Knowledge Base Loaded");
    });

};

loadKB();

exports.chat = async (req, res) => {

  try {

    const { question, category } = req.body;

    const userQuestion = question.toLowerCase();

    const filtered = knowledgeBase.filter(
      item => item.category === category
    );

    // KEYWORD SEARCH
    for (let item of filtered) {

      const keywords = item.question.toLowerCase().split(" ");

      const match = keywords.some(word =>
        userQuestion.includes(word)
      );

      if (match) {

        return res.json({ answer: item.answer });

      }

    }

    // SEMANTIC SEARCH (fallback)
    const answer = await findBestMatch(userQuestion, filtered);

    if (answer) {

      return res.json({ answer });

    }

    // FINAL FALLBACK
    return res.json({
      answer: "Sorry, I couldn't find an answer for that."
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};