const fs = require('fs');
const path = require('path');

function countLOC(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo ou diretório não encontrado: ${filePath}`);
    return 0;
  }

  const stats = fs.statSync(filePath);

  if (stats.isDirectory()) {
    const files = fs.readdirSync(filePath);
    return files.reduce((total, file) => total + countLOC(path.join(filePath, file)), 0);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').length;
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${filePath}`, err);
    return 0;
  }
}

module.exports = { countLOC };
