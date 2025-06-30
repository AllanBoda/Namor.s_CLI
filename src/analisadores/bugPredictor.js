const fs = require("fs");
const path = require("path");

async function predictBugsWithAI(filePath) {
  const code = fs.readFileSync(filePath, "utf8");

  // Simulação de chamada a uma API de LLM
  // Em um cenário real, você faria uma requisição HTTP para uma API como a do Google Gemini, OpenAI GPT, etc.
  // A requisição enviaria o 'code' e receberia as sugestões/previsões.
  const simulatedResponse = {
    suggestions: [
      "Considerar adicionar tratamento de erros para operações de arquivo.",
      "Verificar se todas as variáveis estão sendo inicializadas antes do uso.",
      "Otimizar loops aninhados para melhor performance."
    ],
    potentialBugs: [
      "Possível 'off-by-one error' em iteração de array.",
      "Variável 'x' pode não estar definida em todos os caminhos de execução."
    ],
    confidence: "medium"
  };

  return simulatedResponse;
}

function processDirectoryForBugPrediction(dirPath) {
  let allPredictions = {};
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(filePath) === ".js") {
      allPredictions[filePath] = predictBugsWithAI(filePath);
    } else if (stats.isDirectory()) {
      Object.assign(allPredictions, processDirectoryForBugPrediction(filePath));
    }
  }
  return allPredictions;
}

async function analyzeBugsWithAI(targetPath) {
  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    if (path.extname(targetPath) !== ".js") {
      throw new Error("O arquivo deve ser um arquivo JavaScript.");
    }
    return predictBugsWithAI(targetPath);
  } else if (stats.isDirectory()) {
    return processDirectoryForBugPrediction(targetPath);
  } else {
    throw new Error("O caminho especificado não é um arquivo ou diretório válido.");
  }
}

module.exports = { analyzeBugsWithAI };


