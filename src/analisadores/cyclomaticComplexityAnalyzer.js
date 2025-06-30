const fs = require("fs");
const path = require("path");
const esprima = require("esprima");
const estraverse = require("estraverse");

function calculateComplexity(node) {
  let complexity = 1; // Start with 1 for the function entry point

  estraverse.traverse(node, {
    enter: function (childNode) {
      // Increment complexity for decision points
      if (
        childNode.type === "IfStatement" ||
        childNode.type === "ForStatement" ||
        childNode.type === "WhileStatement" ||
        childNode.type === "DoWhileStatement" ||
        childNode.type === "SwitchStatement" ||
        childNode.type === "CatchClause" ||
        childNode.type === "ConditionalExpression" ||
        childNode.type === "LogicalExpression" && (childNode.operator === "&&" || childNode.operator === "||")
      ) {
        complexity++;
      }
    }
  });
  return complexity;
}

function analyzeCyclomaticComplexity(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const ast = esprima.parseScript(code, { loc: true });

  const functionComplexities = {};

  estraverse.traverse(ast, {
    enter: function (node) {
      if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
        const functionName = node.id ? node.id.name : "anonymous";
        functionComplexities[functionName] = calculateComplexity(node);
      }
    }
  });

  return functionComplexities;
}

function processDirectoryForCyclomaticComplexity(dirPath) {
  let allComplexities = {};
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(filePath) === ".js") {
      Object.assign(allComplexities, analyzeCyclomaticComplexity(filePath));
    } else if (stats.isDirectory()) {
      Object.assign(allComplexities, processDirectoryForCyclomaticComplexity(filePath));
    }
  }
  return allComplexities;
}

function getCyclomaticComplexity(targetPath) {
  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    if (path.extname(targetPath) !== ".js") {
      throw new Error("O arquivo deve ser um arquivo JavaScript.");
    }
    return analyzeCyclomaticComplexity(targetPath);
  } else if (stats.isDirectory()) {
    return processDirectoryForCyclomaticComplexity(targetPath);
  } else {
    throw new Error("O caminho especificado não é um arquivo ou diretório válido.");
  }
}

module.exports = { getCyclomaticComplexity };


