const fs = require('fs');

function countComments(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  let insideBlockComment = false;
  let commentLinesCount = 0;

  for (let line of lines) {
    const trimmed = line.trim();

    if (insideBlockComment) {
      commentLinesCount++;
      if (trimmed.includes('*/')) {
        insideBlockComment = false;
      }
    } else if (trimmed.startsWith('//')) {
      commentLinesCount++;
    } else if (trimmed.includes('/*')) {
      commentLinesCount++;
      if (!trimmed.includes('*/')) {
        insideBlockComment = true;
      }
    }
  }

  return commentLinesCount;
}

module.exports = { countComments };