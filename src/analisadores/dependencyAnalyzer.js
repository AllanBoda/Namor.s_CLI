const fs = require('fs');
const esprima = require('esprima');
const { processPath } = require('../validador/pathValidator');

function analyzeDependencies(filePath) {
  const result = processPath(
    filePath,
    (file) => {
      try {
        const fileContent = fs.readFileSync(file, 'utf-8');
        const ast = esprima.parseModule(fileContent, { tolerant: true }); // Tolerant mode ajuda a ignorar erros
        let totalImports = 0;
        let externalImports = 0;
        let localImports = 0;

        function isLocal(path) {
          return path.startsWith('./') || path.startsWith('../');
        }

        function traverse(node) {
          if (node.type === 'ImportDeclaration') {
            totalImports++;
            if (isLocal(node.source.value)) {
              localImports++;
            } else {
              externalImports++;
            }
          }
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
      } catch (error) {
        return { error: `Erro ao analisar dependências: ${error.message}` };
      }
    },
    (results) => ({
      "Total de dependências": results.reduce((sum, r) => sum + (r["Total de dependências"] || 0), 0),
      "Dependências externas": results.reduce((sum, r) => sum + (r["Dependências externas"] || 0), 0),
      "Dependências locais": results.reduce((sum, r) => sum + (r["Dependências locais"] || 0), 0)
    })
  );
  return result;
}

module.exports = { analyzeDependencies };