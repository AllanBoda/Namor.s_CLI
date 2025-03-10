const esprima = require('esprima');
const fs = require('fs');

function analyzeStructure(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
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
}

module.exports = { analyzeStructure };