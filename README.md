"""# 🧠 Namor's CLI – Analisador de Código JS

![Node.js](https://img.shields.io/badge/Node.js-CLI-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tests](https://img.shields.io/badge/tests-Jest%20passing-brightgreen)

> Uma poderosa ferramenta de linha de comando (CLI) para análise de métricas de qualidade em código JavaScript.

---

## 📑 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Demonstração](#demonstração)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Contribuidores](#contribuidores)
- [Licença](#licença)
- [Referências](#referências)

---

## 📌 Sobre o Projeto

O **Namor's CLI** é uma ferramenta de linha de comando feita em **Node.js** que permite realizar diversas análises estáticas em arquivos JavaScript. Ele fornece métricas como:
- Contagem de linhas de código (LOC)
- Densidade de comentários
- Identação
- Visibilidade de métodos
- Estrutura de classes e funções
- Dependências internas
- Relação entre código e comentários

---

## 🚀 Funcionalidades

- 📏 `--loc`: Contador de linhas de código
- 💬 `--comments`: Contador de comentários
- 📐 `--indentation`: Verificador de identação
- 📊 `--ratio`: Relação comentários/código
- 🧱 `--structure`: Estrutura de classes e funções
- 🔍 `--visibility`: Visibilidade de métodos
- 🔗 `--deps`: Dependências internas do código
- 🤖 `--analyze`: Roda todas as análises acima

---

## 🎥 Demonstração

```bash
# Exemplo de uso:
node ./bin/cli.js --analyze ./exemplo
