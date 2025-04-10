const fs = require('fs');
const { countComments } = require('./commentCounter');

function calculateCommentRatio(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // Total de linhas úteis (ignora vazias)
  const totalLines = lines.filter(line => line.trim() !== '').length;

  const commentLines = countComments(filePath);
  const codeLines = totalLines - commentLines;
  const ratio = totalLines > 0 ? ((commentLines / totalLines) * 100).toFixed(2) : 0;

  return {
    "Total de linhas": totalLines,
    "Linhas de comentário": commentLines,
    "Linhas de código": codeLines,
    "Proporção comentário/código (%)": ratio
  };
}

module.exports = { calculateCommentRatio };
