const { program } = require('commander');
const { countLOC } = require('../lib/locCounter');
const { analyzeStructure } = require('../lib/structureAnalyzer');
const { countComments } = require('../lib/commentCounter');

program
  .version('1.0.0')
  .description('Ferramenta CLI para análise de código')
  .option('--loc <path>', 'Conta as linhas de código de um arquivo ou diretório', (path) => {
    console.log(countLOC(path));
  })
  .option('--analyze <path>', 'Conta funções e classes em um arquivo', (path) => {
    console.log(analyzeStructure(path));
  })
  .option('--comments <path>', 'Conta o número de linhas de comentários em um arquivo', (path) => {
    console.log(countComments(path));
  })
  .option('--help',
    console.log('loc - Conta as linhas de código de um arquivo ou diretório \nanalyze - Conta funções e classes em um arquivo\ncomments - Conta o número de linhas de comentários em um arquivo'))
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}