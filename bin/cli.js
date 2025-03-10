const { program } = require('commander');
const { countLOC } = require('../lib/locCounter');
const { analyzeStructure } = require('../lib/structureAnalyzer');

program
  .version('1.0.0')
  .description('Ferramenta CLI para análise de código')
  .option('--loc <path>', 'Conta as linhas de código de um arquivo ou diretório', (path) => {
    console.log(countLOC(path));
  })
  .option('--analyze <path>', 'Conta funções e classes em um arquivo', (path) => {
    console.log(analyzeStructure(path));
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}