const fs = require('fs');
const path = require('path');
const { analyzeDependencies } = require('../lib/dependencyAnalyzer');

describe('Análise de Dependências', () => {
  const testFilePath = path.join(__dirname, 'testDeps.js');

  beforeAll(() => {
    const testCode = `
      import express from 'express';
      import fs from 'fs';
      import minhaLib from './minhaLib.js';
      const path = require('path');
      const helper = require('../utils/helper.js');
      const config = require('config');
    `;
    fs.writeFileSync(testFilePath, testCode);
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath);
  });

  test('Deve contar corretamente dependências locais e externas', () => {
    const result = analyzeDependencies(testFilePath);

    expect(result).toEqual({
      "Total de dependências": 6,
      "Dependências externas": 4,
      "Dependências locais": 2
    });
  });

  test('Deve lidar com caminho inválido', () => {
    const result = analyzeDependencies('./caminho/invalido.js');
    expect(result).toBe('Erro: O caminho ./caminho/invalido.js não existe.');
  });

  test('Deve retornar 0 dependências para arquivo vazio', () => {
    const emptyPath = path.join(__dirname, 'empty.js');
    fs.writeFileSync(emptyPath, '');

    const result = analyzeDependencies(emptyPath);

    expect(result).toEqual({
      "Total de dependências": 0,
      "Dependências externas": 0,
      "Dependências locais": 0
    });

    fs.unlinkSync(emptyPath);
  });
});
