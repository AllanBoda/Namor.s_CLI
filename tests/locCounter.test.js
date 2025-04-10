const { countLOC } = require('../lib/locCounter');
const fs = require('fs');
const path = require('path');
 
jest.mock('fs');
 
describe('countLOC', () => {
  test('deve contar corretamente as linhas de um arquivo', () => {
    const filePath = 'arquivo.js';
    fs.readFileSync.mockReturnValue('linha 1\nlinha 2\nlinha 3\n');
 
    const result = countLOC(filePath);
    
    expect(result).toBe(3);
  });
 
  test('deve contar linhas de vários arquivos em um diretório', () => {
    const dirPath = 'meuDiretorio';
    fs.readdirSync.mockReturnValue(['file1.js', 'file2.js']);
    
    fs.statSync.mockImplementation((file) => ({
      isFile: () => true
    }));
 
    fs.readFileSync.mockImplementation((file) => {
      if (file.includes('file1.js')) return 'linha 1\nlinha 2\n';
      if (file.includes('file2.js')) return 'linha 3\nlinha 4\nlinha 5\n';
    });
 
    const result = countLOC(dirPath);
    
    expect(result).toBe(5);
  });
 
  test('deve retornar 0 se o arquivo estiver vazio', () => {
    fs.readFileSync.mockReturnValue('');
 
    const result = countLOC('arquivoVazio.js');
    
    expect(result).toBe(0);
  });
});