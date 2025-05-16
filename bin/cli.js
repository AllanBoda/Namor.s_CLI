const { program } = require('commander');
const { countLOC } = require('../lib/locCounter');
const { analyzeStructure } = require('../lib/structureAnalyzer');
const { countComments } = require('../lib/commentCounter');
const { analyzeIndentation } = require('../lib/indentationAnalyzer');
const { analyzeDependencies } = require('../lib/dependencyAnalyzer');
const { calculateCommentRatio } = require('../lib/commentRatio');
const { analyzeMethodVisibility } = require('../lib/methodVisibilityAnalyzer');

// Função para formatar objetos como texto legível
function formatTextOutput(obj, indent = 0) {
  let output = '';
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      output += `${' '.repeat(indent)}${key}:\n${formatTextOutput(value, indent + 2)}`;
    } else {
      output += `${' '.repeat(indent)}${key}: ${value}\n`;
    }
  }
  return output;
}

// Função para formatar a saída
function outputResult(result, options) {
  console.log('DEBUG: JSON option =', options.json); // Depuração
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatTextOutput(result));
  }
}

// Função para tratar erros
function handleError(error, options) {
  console.log('DEBUG: Error occurred, JSON option =', options.json); // Depuração
  const errorMessage = { error: error.message };
  if (options.json) {
    console.error(JSON.stringify(errorMessage, null, 2));
  } else {
    console.error(`Erro: ${error.message}`);
  }
}

program
  .version('1.0.0')
  .description('Namor\'s CLI: Ferramenta para análise de código JavaScript\nExemplo: node cli.js --loc ./src --json')
  .option('--json', 'Exibe a saída no formato JSON');

program
  .command('loc <path>')
  .description('Conta linhas de código em um arquivo ou diretório\nExemplo: loc ./src')
  .action((path) => {
    try {
      const result = countLOC(path);
      outputResult({ linesOfCode: result }, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program
  .command('analyze <path>')
  .description('Conta funções e classes em um arquivo ou diretório\nExemplo: analyze ./src')
  .action((path) => {
    try {
      const result = analyzeStructure(path);
      outputResult(result, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program
  .command('comments <path>')
  .description('Conta linhas de comentários em um arquivo ou diretório\nExemplo: comments ./src')
  .action((path) => {
    try {
      const result = countComments(path);
      outputResult({ commentLines: result }, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program
  .command('indent <path>')
  .description('Analisa níveis de indentação em um arquivo ou diretório\nExemplo: indent ./src --tab-size 2')
  .option('--tab-size <size>', 'Define o tamanho do tab para análise de indentação (padrão: 4)', '4')
  .action((path, options) => {
    try {
      const tabSize = parseInt(options.tabSize, 10);
      if (isNaN(tabSize) || tabSize <= 0) {
        throw new Error('O valor de --tab-size deve ser um número positivo');
      }
      const result = analyzeIndentation(path, tabSize);
      outputResult(result, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program
  .command('deps <path>')
  .description('Analisa dependências em um arquivo ou diretório\nExemplo: deps ./src')
  .action((path) => {
    try {
      const result = analyzeDependencies(path);
      console.log('DEBUG: Deps result =', result); // Depuração
      outputResult(result, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program
  .command('ratio <path>')
  .description('Calcula proporção de comentários em um arquivo ou diretório\nExemplo: ratio ./src')
  .action((path) => {
    try {
      const result = calculateCommentRatio(path);
      outputResult(result, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program
  .command('visibility <path>')
  .description('Conta métodos públicos e privados em um arquivo ou diretório\nExemplo: visibility ./src')
  .action((path) => {
    try {
      const result = analyzeMethodVisibility(path);
      outputResult(result, program.opts());
    } catch (error) {
      handleError(error, program.opts());
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}