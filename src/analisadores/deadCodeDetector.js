const fs = require("fs").promises;
const path = require("path");
const esprima = require("esprima");
const estraverse = require("estraverse");
const escope = require("escope");

async function analyzeDeadCode(filePath) {
    try {
        const code = await fs.readFile(filePath, "utf8");
        const ast = esprima.parseModule(code, { loc: true, tolerant: true });

        const scopeManager = escope.analyze(ast);
        const globalScope = scopeManager.globalScope;

        const declared = new Set();
        const used = new Set();

        // Collect declared identifiers
        estraverse.traverse(ast, {
            enter: function (node, parent) {
                node.parent = parent;
                if (node.type === "FunctionDeclaration") {
                    declared.add(node.id.name);
                } else if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
                    declared.add(node.id.name);
                } else if (node.type === "ClassDeclaration") {
                    declared.add(node.id.name);
                }
            }
        });

        // Collect used identifiers
        estraverse.traverse(ast, {
            enter: function (node) {
                if (node.type === "Identifier" && node.parent) {
                    if (
                        node.parent.type === "CallExpression" ||
                        node.parent.type === "MemberExpression" ||
                        node.parent.type === "AssignmentExpression" ||
                        node.parent.type === "ReturnStatement" ||
                        node.parent.type === "ExpressionStatement" ||
                        node.parent.type === "UpdateExpression" ||
                        node.parent.type === "BinaryExpression" ||
                        node.parent.type === "UnaryExpression" ||
                        node.parent.type === "ExportNamedDeclaration" ||
                        node.parent.type === "ExportDefaultDeclaration"
                    ) {
                        used.add(node.name);
                    }
                }
            }
        });

        const deadCode = [];
        declared.forEach(name => {
            if (!used.has(name)) {
                deadCode.push(name);
            }
        });

        return deadCode;
    } catch (err) {
        console.warn(`Erro ao analisar ${filePath}: ${err.message}`);
        return [];
    }
}

async function processDirectoryForDeadCode(dirPath) {
    let allDeadCode = {};
    try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile() && path.extname(filePath) === ".js") {
                const dead = await analyzeDeadCode(filePath);
                if (dead.length > 0) {
                    allDeadCode[filePath] = dead;
                }
            } else if (stats.isDirectory()) {
                Object.assign(allDeadCode, await processDirectoryForDeadCode(filePath));
            }
        }
    } catch (err) {
        console.warn(`Erro ao processar diretório ${dirPath}: ${err.message}`);
    }
    return allDeadCode;
}

async function findDeadCode(targetPath) {
    try {
        const stats = await fs.stat(targetPath);

        if (stats.isFile()) {
            if (path.extname(targetPath) !== ".js") {
                throw new Error("O arquivo deve ser um arquivo JavaScript.");
            }
            const dead = await analyzeDeadCode(targetPath);
            return dead.length > 0 ? { [targetPath]: dead } : {};
        } else if (stats.isDirectory()) {
            return await processDirectoryForDeadCode(targetPath);
        } else {
            throw new Error("O caminho especificado não é um arquivo ou diretório válido.");
        }
    } catch (err) {
        console.error(`Erro ao encontrar código morto: ${err.message}`);
        throw err;
    }
}

module.exports = { findDeadCode };