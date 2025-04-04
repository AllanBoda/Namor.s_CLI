const fs = require('fs');
const path = require('path');
const { calculateCommentRatio } = require('../lib/commentRatio');

describe('Proporção de Comentário/Código', () => {
  const testFilePath = path.join(__dirname, 'testRatio.js');

  beforeAll(() => {
    const testCode = `
// Comentário 1
function teste() {
  // Comentário 2
  const a = 10; // Comentário 3
  const b = 20;

  /*
    Comentário 4
    Comentário 5
  */
  return a + b;
}
`;
    fs.writeFileSync(testFilePath, testCode);
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath);
  });

  test('Deve calcular corretamente a proporção comentário/código', () => {
    const result = calculateCommentRatio(testFilePath);

    expect(result).toEqual({
      "Total de linhas": 11,
      "Linhas de comentário": 5,
      "Linhas de código": 6,
      "Proporção comentário/código (%)": "45.45"
    });
  });

  test('Deve retornar erro para caminho inválido', () => {
    const result = calculateCommentRatio('./arquivo/inexistente.js');
    expect(result).toBe('Erro: O caminho ./arquivo/inexistente.js não existe.');
  });

  test('Deve retornar tudo zero para arquivo vazio', () => {
    const emptyPath = path.join(__dirname, 'empty.js');
    fs.writeFileSync(emptyPath, '');

    const result = calculateCommentRatio(emptyPath);

    expect(result).toEqual({
      "Total de linhas": 0,
      "Linhas de comentário": 0,
      "Linhas de código": 0,
      "Proporção comentário/código (%)": 0
    });

    fs.unlinkSync(emptyPath);
  });
});
