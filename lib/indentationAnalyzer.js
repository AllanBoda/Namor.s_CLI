const fs = require('fs');

function analyzeIndentation(filePath, tabSize = 4) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  let indentLevels = [];

  for (let line of lines) {
    if (line.trim() === '') continue; // Ignorar linhas vazias

    let leadingWhitespace = line.match(/^[\t ]*/)[0]; // Captura espaços e tabs no início
    let spaces = leadingWhitespace.replace(/\t/g, ' '.repeat(tabSize)).length; // Converte \t para espaços

    indentLevels.push(spaces);
  }

  let maxIndent = Math.max(...indentLevels, 0);
  let avgIndent = indentLevels.length ? (indentLevels.reduce((a, b) => a + b, 0) / indentLevels.length) : 0;

  let indentDistribution = indentLevels.reduce((acc, level) => {
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  return {
    "Maior nível de indentação": maxIndent,
    "Indentação média": avgIndent.toFixed(2),
    "Distribuição dos níveis de indentação": indentDistribution
  };
}

module.exports = { analyzeIndentation };