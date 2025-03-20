# Documentação do Namor's CLI

## Visão Geral

Este projeto é um CLI (Command Line Interface) desenvolvido em Node.js com Jest para testes unitários. Ele permite realizar análises em código-fonte, como contagem de linhas de código, número de funções e classes, e outras métricas relevantes para análise de qualidade.

## Instalação

Para instalar o CLI, utilize o seguinte comando:

sh
npm install -g namor-cli


## Uso

Após a instalação, o CLI pode ser executado com os seguintes comandos:

### Exibir ajuda

sh
namor-cli --help


### Analisar um arquivo ou diretório

sh
namor-cli analyze <caminho>


Exemplo:

sh
namor-cli analyze src/


## Arquitetura

O projeto está organizado nos seguintes diretórios:

- bin/ - Contém o arquivo principal cli.js, responsável por interpretar os comandos do usuário.
- lib/ - Contém os módulos de análise, como locCounter.js (contagem de linhas de código), structureAnalyzer.js (análise da estrutura do código) e complexityAnalyzer.js (análise assintótica das funções).
- tests/ - Contém os testes unitários para cada funcionalidade do CLI.

## Funcionalidades Implementadas

### Contagem de Linhas de Código (LOC)

O módulo lib/locCounter.js realiza a contagem de linhas de código e comentários.

### Contagem de Funções e Classes

O módulo lib/structureAnalyzer.js analisa o código-fonte e conta a quantidade de funções e classes definidas.

### Análise Assintótica das Funções

O módulo lib/complexityAnalyzer.js estima a complexidade assintótica das funções no código-fonte, identificando loops e estrutura do código para indicar sua eficiência.

## Testes Unitários

Os testes são escritos utilizando Jest. Para executar os testes, utilize o seguinte comando:

sh
npm test


Os arquivos de teste estão localizados na pasta tests/ e cobrem as funcionalidades principais do CLI.

## Integração com CI/CD

Para garantir a qualidade contínua do projeto, será implementado um pipeline no GitHub Actions para executar os testes automaticamente a cada commit e verificar a cobertura de código.

## Conclusão

O projeto foi desenvolvido considerando as avaliações passadas pelo professor, atendendo aos critérios de funcionalidade, qualidade do código e documentação. O CLI agora suporta diversas análises de código essenciais para um desenvolvimento eficiente e sustentável.

---

Essa documentação será mantida atualizada conforme novas funcionalidades forem adicionadas ao CLI.
