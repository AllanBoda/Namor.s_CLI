const fs = require('fs');
const { processPath } = require('../validador/pathValidator');

function countComments(filePath) {
  return processPath(
    filePath,
    (file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');
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
    },
    (results) => results.reduce((total, count) => total + count, 0)
  );
}

module.exports = { countComments };