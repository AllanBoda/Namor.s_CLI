const { program } = require('commander');
const { countLOC } = require('../lib/locCounter');
const { analyzeStructure } = require('../lib/structureAnalyzer');
const { countComments } = require('../lib/commentCounter');
const { analyzeIndentation } = require('../lib/indentationAnalyzer');
const { analyzeDependencies } = require('../lib/dependencyAnalyzer');
const { calculateCommentRatio } = require('../lib/commentRatio');
const { analyzeMethodVisibility } = require('../lib/methodVisibilityAnalyzer');
//comentario de teste
/*
COmentario de bloco
as

*/
program
  .version('1.0.0')
  .description('Ferramenta Namor"s ClI para análise de código')
  .option('--loc <path>', 'Conta as linhas de código de um arquivo ou diretório', (path) => {
    console.log(countLOC(path));
  })
  .option('--analyze <path>', 'Conta funções e classes em um arquivo', (path) => {
    console.log(analyzeStructure(path));
  })
  .option('--comments <path>', 'Conta o número de linhas de comentários em um arquivo', (path) => {
    console.log(countComments(path));
  })
  .option('--indent <path>', 'Analisa os níveis de indentação', (path) => {
    console.log(analyzeIndentation(path));
  })
  .option('--deps <path>', 'Analisa as dependências do arquivo', (path) => {
    console.log(analyzeDependencies(path));
  })
  .option('--ratio <path>', 'Calcula a proporção de comentários em relação ao código', (path) => {
    console.log(calculateCommentRatio(path));
  })
  .option('--visibility <path>', 'Conta métodos públicos e privados de classes', (path) => {
    console.log(analyzeMethodVisibility(path));
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
