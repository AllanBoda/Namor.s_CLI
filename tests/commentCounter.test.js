const { countComments } = require('../lib/commentCounter');
const fs = require('fs');
const path = require('path');

test('Conta linhas de comentários em um arquivo', () => {
  const testFile = path.join(__dirname, 'testFile.js');
  fs.writeFileSync(testFile, '// Comentário 1\nconst x = 10;\n/* Comentário 2 */');
  expect(countComments(testFile)).toBe(2);
  fs.unlinkSync(testFile);
});

test('Retorna erro para arquivo inexistente', () => {
  expect(countComments('invalid.js')).toBe('Erro: O caminho invalid.js não existe.');
});