const fs = require('fs');
const esprima = require('esprima');

function analyzeMethodVisibility(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const ast = esprima.parseModule(fileContent, { tolerant: true });

  let publicMethods = 0;
  let privateMethods = 0;

  function traverse(node) {
    if (node.type === 'ClassDeclaration' && node.body && node.body.body) {
      node.body.body.forEach(element => {
        if (element.type === 'MethodDefinition') {
          const methodName = element.key.name || '';
          if (element.key.type === 'PrivateIdentifier' || methodName.startsWith('#')) {
            privateMethods++;
          } else {
            publicMethods++;
          }
        }
      });
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        traverse(node[key]);
      }
    }
  }

  traverse(ast);

  return {
    "Métodos públicos": publicMethods,
    "Métodos privados": privateMethods
  };
}

module.exports = { analyzeMethodVisibility };