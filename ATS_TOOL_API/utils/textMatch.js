const natural = require("natural");

// Simple keyword matching function
const compareText = (resumeText, jobDescription) => {
    //console.log("rohuuuuuu")
//console.log(resumeText)
//console.log("jobDescription",jobDescription)
  const tokenizer = new natural.WordTokenizer();
  const resumeTokens = tokenizer.tokenize(resumeText);
  const jobDescriptionTokens = tokenizer.tokenize(jobDescription);

  let matchedKeywords = 0;
  jobDescriptionTokens.forEach((token) => {
    if (resumeTokens.includes(token)) {
      matchedKeywords++;
    }
  });

  const atsScore = (matchedKeywords / jobDescriptionTokens.length) * 100;
  return atsScore.toFixed(2); // Returning percentage score
};

module.exports = { compareText };
