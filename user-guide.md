Manual do Usuário - Namor's CLI
Este manual fornece instruções detalhadas sobre como instalar, configurar e usar o Namor's CLI, uma ferramenta de linha de comando para análise estática de código JavaScript.
1. Introdução
O Namor's CLI é uma ferramenta projetada para ajudar desenvolvedores a analisar arquivos JavaScript, fornecendo métricas como contagem de linhas, estrutura do código, proporção de comentários, níveis de indentação, dependências e visibilidade de métodos. É ideal para equipes que desejam melhorar a qualidade do código ou auditar projetos existentes.
2. Pré-requisitos

Node.js (versão 14 ou superior)
npm (geralmente incluído com o Node.js)
Sistema operacional: Windows, macOS ou Linux

3. Instalação
Siga estas etapas para instalar o Namor's CLI:

Clone o repositório:git clone [https://github.com/seu-usuario/namors-cli.git](https://github.com/AllanBoda/Namor.s_CLI)


Navegue até o diretório do projeto:cd namors-cli


Instale as dependências:npm install


(Opcional) Para usar o CLI globalmente:npm link



4. Primeiros Passos
Para começar a usar o Namor's CLI rapidamente:

Certifique-se de ter o Node.js instalado (node --version).
Após a instalação, teste o CLI com o comando de ajuda:node cli.js --help


Experimente analisar um arquivo JavaScript com um comando simples, como:node cli.js --loc ./src/arquivo.js

Isso exibirá o número de linhas de código no arquivo.

5. Uso Básico
Para executar o CLI, use o comando node cli.js seguido de uma opção e o caminho do arquivo ou diretório. Execute --help para ver todas as opções disponíveis:
node cli.js --help

5.1. Opções Disponíveis



Comando
Descrição
Exemplo



--loc <path>
Conta as linhas de código.
node cli.js --loc src/arquivo.js


--analyze <path>
Conta funções e classes.
node cli.js --analyze src/arquivo.js


--comments <path>
Conta linhas de comentários.
node cli.js --comments src/arquivo.js


--indent <path>
Analisa níveis de indentação.
node cli.js --indent src/arquivo.js


--deps <path>
Analisa dependências externas e locais.
node cli.js --deps src/arquivo.js


--ratio <path>
Calcula proporção de comentários em relação ao código.
node cli.js --ratio src/arquivo.js


--visibility <path>
Conta métodos públicos e privados em classes.
node cli.js --visibility src/arquivo.js


5.2. Exemplos Práticos

Contar linhas de código em um diretório:
node cli.js --loc ./src

Saída esperada:
150


Analisar estrutura de um arquivo:
node cli.js --analyze ./src/arquivo.js

Saída esperada:
{ "functions": 2, "classes": 0 }


Calcular proporção de comentários:
node cli.js --ratio ./src/arquivo.js

Saída esperada:
{
  "Total de linhas": 50,
  "Linhas de comentário": 10,
  "Linhas de código": 40,
  "Proporção comentário/código (%)": "20.00"
}


Analisar visibilidade de métodos:
node cli.js --visibility ./src/arquivo.js

Saída esperada:
{
  "Métodos públicos": 3,
  "Métodos privados": 1
}



6. Solução de Problemas

Erro: "Arquivo ou diretório não encontrado"
Verifique se o caminho fornecido está correto.
Certifique-se de que o arquivo ou diretório existe.


Erro: "Cannot find module"
Execute npm install para instalar as dependências.


Nenhuma saída após executar o comando
Verifique se você forneceu uma opção válida (use --help para listar opções).


Saída inesperada ou incorreta
Confirme que o arquivo de entrada é um arquivo JavaScript válido.
Para comandos como --visibility, certifique-se de que o arquivo contém classes com métodos.



7. Contato
Para suporte ou sugestões, envie um e-mail para ldgdanielgomes@gmail.com.
8. Notas Finais
O Namor's CLI é uma ferramenta em desenvolvimento ativo. Novas funcionalidades e melhorias serão adicionadas regularmente. Acompanhe o repositório no GitHub para atualizações.
