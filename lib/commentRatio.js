const fs = require('fs');
const { countComments } = require('./commentCounter');
const { processPath } = require('../validador/pathValidator');

function calculateCommentRatio(filePath) {
  return processPath(
    filePath,
    (file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const lines = fileContent.split('\n');

      const totalLines = lines.filter(line => line.trim() !== '').length;
      const commentLines = countComments(file);
      const codeLines = totalLines - commentLines;
      const ratio = totalLines > 0 ? ((commentLines / totalLines) * 100).toFixed(2) : 0;

      return { totalLines, commentLines, codeLines, ratio };
    },
    (results) => {
      const totalLines = results.reduce((sum, r) => sum + r.totalLines, 0);
      const commentLines = results.reduce((sum, r) => sum + r.commentLines, 0);
      const codeLines = results.reduce((sum, r) => sum + r.codeLines, 0);
      const ratio = totalLines > 0 ? ((commentLines / totalLines) * 100).toFixed(2) : 0;

      return {
        "Total de linhas": totalLines,
        "Linhas de comentário": commentLines,
        "Linhas de código": codeLines,
        "Proporção comentário/código (%)": ratio
      };
    }
  );
}

module.exports = { calculateCommentRatio };