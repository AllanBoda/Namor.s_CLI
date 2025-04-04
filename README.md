# Documentação do Namor's CLI

## Visão Geral

Este projeto é um CLI (Command Line Interface) desenvolvido em Node.js com Jest para testes unitários. Ele permite realizar análises em código-fonte JavaScript, como contagem de linhas de código, número de funções e classes, e outras métricas relevantes para análise de qualidade.

## Instalação

Para instalar o CLI, utilize o seguinte comando:

sh
npm install -g node ./bin/cli.js


## Uso

Após a instalação, o CLI pode ser executado com os seguintes comandos:

### Exibir ajuda

sh
node ./bin/cli.js --help <caminho>


### Analisar um arquivo ou diretório

sh
node ./bin/cli.js --loc <caminho>
node ./bin/cli.js --analyze <caminho>
node ./bin/cli.js --comments <caminho>
node ./bin/cli.js --indentation <caminho>
node ./bin/cli.js --deps <caminho>
node ./bin/cli.js --ratio <caminho>
node ./bin/cli.js --visibility <caminho>


Exemplo:

sh
node ./bin/cli.js analyze src/


## Arquitetura

O projeto está organizado nos seguintes diretórios:

- bin/ - Contém o arquivo principal cli.js, responsável por interpretar os comandos do usuário.

- lib/ - Contém os módulos de análise:

- locCounter.js: contagem de linhas de código

- structureAnalyzer.js: contagem de funções e classes

- commentCounter.js: contagem de comentários

- indentationAnalyzer.js: análise de níveis de indentação

- dependencyAnalyzer.js: número de dependências externas

- commentRatio.js: proporção comentário/código

- methodVisibilityAnalyzer.js: contagem de métodos públicos e privados

- tests/ - Contém os testes unitários para cada funcionalidade do CLI.

## Funcionalidades Implementadas

### Contagem de Linhas de Código (LOC)

O módulo lib/locCounter.js realiza a contagem de linhas de código e comentários.

### Contagem de Funções e Classes

O módulo lib/structureAnalyzer.js analisa o código-fonte e conta a quantidade de funções e classes definidas.

### Linhas de Comentário

O módulo lib/commentCounter.js identifica e contabiliza comentários de linha (//) e de bloco (/* ... */), incluindo casos em que os blocos se estendem por várias linhas.

### Níveis de Indentação

O módulo lib/indentationAnalyzer.js contabiliza a quantidade de linhas com diferentes níveis de indentação. Tabs são tratados como 4 espaços.

### Número de Dependências Externas

O módulo lib/dependencyAnalyzer.js analisa o código em busca de comandos import e require() para identificar módulos externos utilizados.

### Proporção Comentário/Código

O módulo lib/commentRatio.js calcula a razão entre o número de linhas de comentário e o total de linhas úteis (não vazias).

### Número de Métodos Públicos/Privados

O módulo lib/methodVisibilityAnalyzer.js percorre a estrutura do código para identificar métodos declarados dentro de classes e classifica-os como públicos ou privados, com base na presença do prefixo #.

## Testes Unitários

Os testes são escritos utilizando Jest. Para executar os testes, utilize o seguinte comando:

 - npm test

ou

 - npx jest tests/<TítuloDoCódigo>.test.js

Os arquivos de teste estão localizados na pasta tests/ e cobrem as funcionalidades principais do CLI, incluindo casos de sucesso e falha.

## Integração com CI/CD

Para garantir a qualidade contínua do projeto, será implementado um pipeline no GitHub Actions para:

 - Executar os testes automaticamente a cada commit

 - Verificar a cobertura de testes

 - Garantir a integridade da ferramenta

## Conclusão

O projeto foi desenvolvido considerando as avaliações passadas pelo professor, atendendo aos critérios de funcionalidade, qualidade do código e documentação. O Namor's CLI agora suporta diversas análises de código essenciais para um desenvolvimento eficiente e sustentável.

---

Essa documentação será mantida atualizada conforme novas funcionalidades forem adicionadas ao CLI.
