const esprima = require("esprima");
const fs = require("fs").promises;
const path = require("path");
const estraverse = require("estraverse");

function getFunctionSize(node) {
    // Calculate the size of a function (lines of code)
    const startLine = node.loc.start.line;
    const endLine = node.loc.end.line;
    return endLine - startLine + 1;
}

async function analyzeAverageFunctionSize(filePath) {
    try {
        const code = await fs.readFile(filePath, "utf8");
        const ast = esprima.parseModule(code, { loc: true, tolerant: true });

        let totalFunctionSize = 0;
        let functionCount = 0;

        estraverse.traverse(ast, {
            enter: function (node) {
                if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
                    totalFunctionSize += getFunctionSize(node);
                    functionCount++;
                }
            }
        });

        return { totalSize: totalFunctionSize, functionCount };
    } catch (err) {
        console.warn(`Erro ao analisar ${filePath}: ${err.message}`);
        return { totalSize: 0, functionCount: 0 };
    }
}

async function processDirectory(dirPath) {
    let totalFunctionSize = 0;
    let totalFunctionCount = 0;

    try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile() && path.extname(filePath) === ".js") {
                const { totalSize, functionCount } = await analyzeAverageFunctionSize(filePath);
                totalFunctionSize += totalSize;
                totalFunctionCount += functionCount;
            } else if (stats.isDirectory()) {
                const subDirResult = await processDirectory(filePath);
                totalFunctionSize += subDirResult.totalFunctionSize;
                totalFunctionCount += subDirResult.totalFunctionCount;
            }
        }
    } catch (err) {
        console.warn(`Erro ao processar diretório ${dirPath}: ${err.message}`);
    }

    return { totalFunctionSize, totalFunctionCount };
}

async function calculateAverageFunctionSize(targetPath) {
    try {
        const stats = await fs.stat(targetPath);

        if (stats.isFile()) {
            if (path.extname(targetPath) !== ".js") {
                throw new Error("O arquivo deve ser um arquivo JavaScript.");
            }
            const { totalSize, functionCount } = await analyzeAverageFunctionSize(targetPath);
            return functionCount > 0 ? totalSize / functionCount : 0;
        } else if (stats.isDirectory()) {
            const { totalFunctionSize, totalFunctionCount } = await processDirectory(targetPath);
            return totalFunctionCount > 0 ? totalFunctionSize / totalFunctionCount : 0;
        } else {
            throw new Error("O caminho especificado não é um arquivo ou diretório válido.");
        }
    } catch (err) {
        console.error(`Erro ao calcular tamanho médio: ${err.message}`);
        throw err;
    }
}

module.exports = { calculateAverageFunctionSize };