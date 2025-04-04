const { analyzeStructure } = require('../lib/structureAnalyzer');
 
describe('analyzeStructure', () => {
  test('deve contar corretamente funções e classes em um código', () => {
    const code = `
      function teste() {}
      class MinhaClasse {}
      const minhaFuncao = () => {};
    `;
 
    const result = analyzeStructure(code);
    
    expect(result.functions).toBe(2);
    expect(result.classes).toBe(1);
  });
 
  test('deve retornar 0 se não houver funções ou classes', () => {
    const code = `
      const a = 10;
      const b = 20;
    `;
 
    const result = analyzeStructure(code);
    
    expect(result.functions).toBe(0);
    expect(result.classes).toBe(0);
  });
 
  test('deve contar funções e classes em um código complexo', () => {
    const code = `
      class A {}
      function b() {}
      const c = function() {};
      const d = () => {};
      class E {}
    `;
 
    const result = analyzeStructure(code);
    
    expect(result.functions).toBe(3);
    expect(result.classes).toBe(2);
  });
});