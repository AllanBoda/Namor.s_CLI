const fs = require('fs');
const path = require('path');
//Teste
function countLOC(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    const files = fs.readdirSync(filePath);
    return files.reduce((total, file) => total + countLOC(path.join(filePath, file)), 0);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return fileContent.split('\n').length;
}

module.exports = { countLOC };