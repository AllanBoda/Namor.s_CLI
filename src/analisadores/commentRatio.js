const { countLOC } = require('./locCounter');
const { countComments } = require('./commentCounter');

async function calculateCommentRatio(projectPath) {
  const totalLines = await countLOC(projectPath);
  const commentLines = await countComments(projectPath);
  const codeLines = totalLines - commentLines;
  const ratio = ((commentLines / totalLines) * 100).toFixed(2);
  return {
    "Total de linhas": totalLines,
    "Linhas de comentário": commentLines,
    "Linhas de código": codeLines,
    "Proporção comentário/código (%)": `${ratio}`
  };
}

module.exports = { calculateCommentRatio };