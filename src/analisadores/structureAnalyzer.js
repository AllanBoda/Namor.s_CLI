const esprima = require('esprima');
const fs = require('fs');
const { processPath } = require('../validador/pathValidator');

function analyzeStructure(filePath) {
  return processPath(
    filePath,
    (file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const ast = esprima.parseScript(fileContent, { tolerant: true });
      
      let functionCount = 0;
      let classCount = 0;
      
      function traverse(node) {
        if (node.type === 'FunctionDeclaration') {
          functionCount++;
        } else if (node.type === 'ClassDeclaration') {
          classCount++;
        }
        for (const key in node) {
          if (node[key] && typeof node[key] === 'object') {
            traverse(node[key]);
          }
        }
      }
      
      traverse(ast);
      
      return { functions: functionCount, classes: classCount };
    },
    (results) => ({
      functions: results.reduce((sum, r) => sum + r.functions, 0),
      classes: results.reduce((sum, r) => sum + r.classes, 0)
    })
  );
}

module.exports = { analyzeStructure };