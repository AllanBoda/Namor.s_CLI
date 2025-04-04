const fs = require('fs');
const esprima = require('esprima');

function analyzeDependencies(filePath) {
  if (!fs.existsSync(filePath)) {
    return `Erro: O caminho ${filePath} não existe.`;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const ast = esprima.parseModule(fileContent, { tolerant: true });

  let totalImports = 0;
  let externalImports = 0;
  let localImports = 0;

  function isLocal(path) {
    return path.startsWith('./') || path.startsWith('../');
  }

  function traverse(node) {
    // import ... from '...'
    if (node.type === 'ImportDeclaration') {
      totalImports++;
      if (isLocal(node.source.value)) {
        localImports++;
      } else {
        externalImports++;
      }
    }

    // const x = require('...');
    if (
      node.type === 'CallExpression' &&
      node.callee.name === 'require' &&
      node.arguments.length &&
      node.arguments[0].type === 'Literal'
    ) {
      totalImports++;
      const moduleName = node.arguments[0].value;
      if (isLocal(moduleName)) {
        localImports++;
      } else {
        externalImports++;
      }
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        traverse(node[key]);
      }
    }
  }

  traverse(ast);

  return {
    "Total de dependências": totalImports,
    "Dependências externas": externalImports,
    "Dependências locais": localImports
  };
}

module.exports = { analyzeDependencies };