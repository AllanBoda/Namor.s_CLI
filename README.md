# CLI de Análise de Código

## 📌 Sobre
Esta ferramenta CLI permite analisar arquivos e diretórios de código-fonte, fornecendo métricas como:
- **Contagem de Linhas de Código (LOC)**
- **Contagem de Funções e Classes**
- **Contagem de Linhas de Comentário**

## 🚀 Instalação
Para instalar globalmente, execute:
```sh
npm install -g ./
```
Isso permitirá que você use o comando `cli` em qualquer lugar do sistema.

## 📖 Uso
### 📌 Exibir ajuda:
```sh
cli --help
```

### 📌 Contar linhas de código:
```sh
cli --loc caminho do arquivo
```

### 📌 Contar funções e classes:
```sh
cli --analyze caminho do arquivo
```

### 📌 Contar linhas de comentário:
```sh
cli --comments caminho do arquivo
```

## 🛠️ Testes
Para rodar os testes automatizados:
```sh
npx jest
```

## 🏗️ Arquitetura do Projeto
O projeto está estruturado da seguinte forma:
```
📂 projeto-cli
│-- 📂 bin
│   ├── cli.js  # Arquivo principal da CLI
│-- 📂 lib
│   ├── locCounter.js  # Contagem de linhas de código
│   ├── structureAnalyzer.js  # Análise de funções e classes
│   ├── commentCounter.js  # Contagem de comentários
│-- 📂 tests
│   ├── locCounter.test.js  # Testes para contagem de linhas
│   ├── structureAnalyzer.test.js  # Testes para funções/classes
│   ├── commentCounter.test.js  # Testes para comentários
│-- package.json  # Configuração do projeto
│-- README.md  # Documentação
```

## 📜 Licença
Projeto open-source sob a licença MIT.
