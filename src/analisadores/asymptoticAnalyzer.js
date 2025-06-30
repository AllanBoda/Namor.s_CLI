const fs = require("fs");
const path = require("path");
const esprima = require("esprima");
const estraverse = require("estraverse");

function analyzeFunctionComplexity(node) {
  let operationCount = 0;
  let maxDepth = 0;
  let currentDepth = 0;

  estraverse.traverse(node, {
    enter: function (childNode) {
      currentDepth++;
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }

      // Simplified operation counting
      if (childNode.type === "BinaryExpression" || childNode.type === "AssignmentExpression") {
        operationCount++;
      } else if (childNode.type === "CallExpression") {
        operationCount += 5; // Arbitrary cost for function calls
      } else if (childNode.type === "ForStatement" || childNode.type === "WhileStatement" || childNode.type === "DoWhileStatement") {
        operationCount += 10; // Arbitrary cost for loops
      } else if (childNode.type === "IfStatement" || childNode.type === "ConditionalExpression") {
        operationCount += 2; // Arbitrary cost for conditionals
      }
    },
    leave: function () {
      currentDepth--;
    }
  });

  // A very simplified heuristic for complexity
  // This is NOT a rigorous asymptotic analysis, but a basic indicator.
  // A true asymptotic analysis is much more complex and often requires manual inspection or advanced tools.
  let complexityIndicator = operationCount;
  if (maxDepth > 3) {
    complexityIndicator *= (maxDepth / 2); // Deeper nesting implies higher complexity
  }

  return {
    operationCount: operationCount,
    maxNestingDepth: maxDepth,
    complexityIndicator: Math.round(complexityIndicator)
  };
}

function analyzeAsymptoticComplexity(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const ast = esprima.parseScript(code, { loc: true });

  const functionComplexities = {};

  estraverse.traverse(ast, {
    enter: function (node) {
      if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
        const functionName = node.id ? node.id.name : "anonymous";
        functionComplexities[functionName] = analyzeFunctionComplexity(node);
      }
    }
  });

  return functionComplexities;
}

function processDirectoryForAsymptoticAnalysis(dirPath) {
  let allComplexities = {};
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(filePath) === ".js") {
      Object.assign(allComplexities, analyzeAsymptoticComplexity(filePath));
    } else if (stats.isDirectory()) {
      Object.assign(allComplexities, processDirectoryForAsymptoticAnalysis(filePath));
    }
  }
  return allComplexities;
}

function getAsymptoticAnalysis(targetPath) {
  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    if (path.extname(targetPath) !== ".js") {
      throw new Error("O arquivo deve ser um arquivo JavaScript.");
    }
    return analyzeAsymptoticComplexity(targetPath);
  } else if (stats.isDirectory()) {
    return processDirectoryForAsymptoticAnalysis(targetPath);
  } else {
    throw new Error("O caminho especificado não é um arquivo ou diretório válido.");
  }
}

module.exports = { getAsymptoticAnalysis };


