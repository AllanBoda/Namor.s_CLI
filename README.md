# Namor's CLI - Ferramenta de Análise de Código

Bem-vindo ao **Namor's CLI**, uma ferramenta de linha de comando desenvolvida para análise estática de código JavaScript. Este projeto permite que desenvolvedores avaliem métricas como linhas de código, estrutura do código, comentários, indentação, dependências e visibilidade de métodos, fornecendo insights valiosos para melhorar a qualidade do código.

## Sobre o Projeto
O Namor's CLI é uma ferramenta modular que processa arquivos ou diretórios JavaScript, gerando relatórios detalhados sobre:
- Contagem de linhas de código (LOC).
- Análise de funções e classes.
- Contagem de comentários e proporção comentário/código.
- Níveis de indentação.
- Dependências externas e locais.
- Visibilidade de métodos em classes (públicos e privados).

O projeto foi desenvolvido com Node.js e utiliza bibliotecas como `commander` para interface CLI e `esprima` para análise de código.

## Pré-requisitos
- **Node.js** (versão 14 ou superior)
- **npm** (geralmente incluído com o Node.js)

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/namors-cli.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd namors-cli
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. (Opcional) Vincule o CLI globalmente para uso em qualquer diretório:
   ```bash
   npm link
   ```

## Como Usar
Execute o comando `node cli.js` seguido de uma das opções disponíveis. Use `--help` para ver todas as opções:

```bash
node cli.js --help
```

### Exemplos
- Contar linhas de código em um arquivo:
  ```bash
  node cli.js --loc caminho/para/arquivo.js
  ```
- Analisar funções e classes:
  ```bash
  node cli.js --analyze caminho/para/arquivo.js
  ```
- Calcular proporção de comentários:
  ```bash
  node cli.js --ratio caminho/para/arquivo.js
  ```

## Opções Disponíveis
| Opção            | Descrição                                              |
|------------------|--------------------------------------------------------|
| `--loc <path>`   | Conta as linhas de código de um arquivo ou diretório.   |
| `--analyze <path>` | Conta funções e classes em um arquivo.               |
| `--comments <path>` | Conta linhas de comentários.                         |
| `--indent <path>` | Analisa níveis de indentação.                         |
| `--deps <path>`   | Analisa dependências do arquivo.                      |
| `--ratio <path>`  | Calcula proporção de comentários em relação ao código. |
| `--visibility <path>` | Conta métodos públicos e privados de classes.      |

## Contribuindo
Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato
Para dúvidas ou sugestões, entre em contato pelo e-mail: seu.email@example.com.
