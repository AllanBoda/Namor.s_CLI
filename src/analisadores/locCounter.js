const fs = require('fs');
const { processPath } = require('../validador/pathValidator');

function countLOC(filePath) {
  return processPath(
    filePath,
    (file) => {
      try {
        const fileContent = fs.readFileSync(file, 'utf-8');
        return fileContent.split('\n').length;
      } catch (err) {
        throw new Error(`Erro ao ler o arquivo: ${file} - ${err.message}`);
      }
    },
    (results) => results.reduce((total, count) => total + count, 0)
  );
}

module.exports = { countLOC };