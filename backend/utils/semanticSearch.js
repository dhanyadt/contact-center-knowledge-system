const { pipeline } = require("@xenova/transformers");

let extractor;

async function loadModel() {
  extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
}

function cosineSimilarity(a, b) {

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {

    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];

  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function findBestMatch(userQuestion, knowledgeBase) {

  const userEmbedding = await extractor(userQuestion);

  let bestScore = -1;
  let bestAnswer = null;

  for (let item of knowledgeBase) {

    const kbEmbedding = await extractor(item.question);

    const score = cosineSimilarity(
      userEmbedding.data,
      kbEmbedding.data
    );

    if (score > bestScore) {

      bestScore = score;
      bestAnswer = item.answer;

    }

  }

  return bestAnswer;
}

module.exports = {
  loadModel,
  findBestMatch
};