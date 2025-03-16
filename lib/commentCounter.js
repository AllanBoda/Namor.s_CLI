const fs = require('fs');

function countComments(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  
  const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().endsWith('*/'));
  
  return commentLines.length;
}

module.exports = { countComments };