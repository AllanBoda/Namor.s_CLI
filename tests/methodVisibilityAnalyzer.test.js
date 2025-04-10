const fs = require('fs');
const path = require('path');
const { analyzeMethodVisibility } = require('../lib/methodVisibilityAnalyzer');

describe('Análise de Visibilidade de Métodos', () => {
  const filePath = path.join(__dirname, 'visibilidadeTest.js');

  beforeAll(() => {
    const testCode = `
      class Pessoa {
        falar() {}            // público
        andar() {}            // público
        #pensar() {}          // privado
        ['mover']() {}        // público (nome computado)
      }

      class Animal {
        #respirar() {}        // privado
        comer() {}            // público
      }

      function fora() {
        function interna() {
          return true;
        }
      }
    `;
    fs.writeFileSync(filePath, testCode);
  });

  afterAll(() => {
    fs.unlinkSync(filePath);
  });

  test('Deve contar métodos públicos e privados corretamente', () => {
    const result = analyzeMethodVisibility(filePath);

    expect(result).toEqual({
      "Métodos públicos": 4,
      "Métodos privados": 2
    });
  });

  test('Deve retornar erro para arquivo inexistente', () => {
    const result = analyzeMethodVisibility('./inexistente.js');
    expect(result).toBe('Erro: O caminho ./inexistente.js não existe.');
  });

  test('Deve retornar 0 públicos e 0 privados para arquivo sem classes', () => {
    const semClasse = path.join(__dirname, 'semClasse.js');
    fs.writeFileSync(semClasse, `function solta() { return 1; }`);

    const result = analyzeMethodVisibility(semClasse);

    expect(result).toEqual({
      "Métodos públicos": 0,
      "Métodos privados": 0
    });

    fs.unlinkSync(semClasse);
  });
});
