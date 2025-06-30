const fs = require('fs');
const { processPath } = require('../validador/pathValidator');

function analyzeIndentation(filePath, tabSize = 4) {
  return processPath(
    filePath,
    (file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');
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
        maxIndent,
        avgIndent,
        indentDistribution
      };
    },
    (results) => {
      const maxIndent = Math.max(...results.map(r => r.maxIndent), 0);
      const avgIndent = results.length
        ? (results.reduce((sum, r) => sum + r.avgIndent, 0) / results.length).toFixed(2)
        : 0;
      const indentDistribution = results.reduce((acc, r) => {
        for (const level in r.indentDistribution) {
          acc[level] = (acc[level] || 0) + r.indentDistribution[level];
        }
        return acc;
      }, {});

      return {
        "Maior nível de indentação": maxIndent,
        "Indentação média": avgIndent,
        "Distribuição dos níveis de indentação": indentDistribution
      };
    }
  );
}

module.exports = { analyzeIndentation };