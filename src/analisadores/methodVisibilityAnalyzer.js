const fs = require('fs');
const esprima = require('esprima');
const { processPath } = require('../validador/pathValidator');

function analyzeMethodVisibility(filePath) {
  return processPath(
    filePath,
    (file) => {
      try {
        const fileContent = fs.readFileSync(file, 'utf-8');
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
        return { publicMethods, privateMethods };
      } catch (error) {
        return { error: `Erro ao analisar visibilidade: ${error.message}` };
      }
    },
    (results) => ({
      "Métodos públicos": results.reduce((sum, r) => sum + (r.publicMethods || 0), 0),
      "Métodos privados": results.reduce((sum, r) => sum + (r.privateMethods || 0), 0)
    })
  );
}

module.exports = { analyzeMethodVisibility };