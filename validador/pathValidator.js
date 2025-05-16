const fs = require('fs');
const path = require('path');

function validatePath(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Caminho inválido: ${filePath}`);
  }
  return fs.statSync(filePath);
}

function processPath(filePath, processFile, aggregateResults) {
  const stats = validatePath(filePath);

  if (stats.isDirectory()) {
    const files = fs.readdirSync(filePath);
    const results = files
      .filter(file => file.endsWith('.js')) // Processa apenas arquivos .js
      .map(file => processPath(path.join(filePath, file), processFile, aggregateResults));
    return aggregateResults(results);
  }

  return processFile(filePath);
}

module.exports = { validatePath, processPath };