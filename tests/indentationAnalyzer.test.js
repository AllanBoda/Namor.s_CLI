const { analyzeIndentation } = require('../lib/indentationAnalyzer');
const fs = require('fs');

describe('Análise de Indentação', () => {
  const testFilePath = './tests/testIndent.js';

  beforeAll(() => {
    const testCode = `
function exemplo() {
  if (true) {
    console.log("Indentação nível 2");
      console.log("Indentação nível 4");
  }
}
`;
    fs.writeFileSync(testFilePath, testCode);
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath); // Remover arquivo de teste após os testes
  });

  test('Deve analisar corretamente os níveis de indentação', () => {
    const result = analyzeIndentation(testFilePath);
    
    expect(result['Maior nível de indentação']).toBe(4);
    expect(result['Indentação média']).toBe("2.00");
    expect(result['Distribuição dos níveis de indentação']).toEqual({
      "0": 2, // function e if
      "2": 2, // console.log (2x)
      "4": 1  // console.log com 4 espaços
    });
  });

  test('Deve retornar erro se o arquivo não existir', () => {
    const result = analyzeIndentation('./caminho/invalido.js');
    expect(result).toBe('Erro: O caminho ./caminho/invalido.js não existe.');
  });

  test('Deve lidar corretamente com arquivos vazios', () => {
    const emptyFilePath = './tests/empty.js';
    fs.writeFileSync(emptyFilePath, ''); // Criar um arquivo vazio

    test('Deve analisar corretamente indentação com tabs', () => {
        const tabFilePath = './tests/testTab.js';
        const testCode = `
      function tabExample() {
      \tif (true) {
      \t\tconsole.log("Tab nível 2");
      \t\t\tconsole.log("Tab nível 3");
      \t}
      }
      `;
      
        fs.writeFileSync(tabFilePath, testCode);
      
        const result = analyzeIndentation(tabFilePath, 4); // Considerando tab = 4 espaços
      
        expect(result['Maior nível de indentação']).toBe(8);
        expect(result['Indentação média']).toBe("3.00");
        expect(result['Distribuição dos níveis de indentação']).toEqual({
          "0": 2, // function e if
          "4": 2, // console.log (2x) -> tabs convertidos para 4 espaços
          "8": 1  // console.log com tab extra (8 espaços)
        });
      
        fs.unlinkSync(tabFilePath); // Remover arquivo de teste após rodar
      });
      
    const result = analyzeIndentation(emptyFilePath);
    
    expect(result['Maior nível de indentação']).toBe(0);
    expect(result['Indentação média']).toBe("0.00");
    expect(result['Distribuição dos níveis de indentação']).toEqual({});

    fs.unlinkSync(emptyFilePath); // Remover arquivo vazio após teste
  });
});
