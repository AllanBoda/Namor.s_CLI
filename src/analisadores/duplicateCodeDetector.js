const fs = require("fs").promises;
const path = require("path");
const esprima = require("esprima");
const estraverse = require("estraverse");

function normalizeCode(code) {
    // Simple normalization: remove extra whitespace
    return code.replace(/\s+/g, ' ').trim();
}

function getCodeBlocks(ast) {
    const blocks = [];
    estraverse.traverse(ast, {
        enter: function (node) {
            if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "BlockStatement") {
                blocks.push(node);
            }
        }
    });
    return blocks;
}

function getCodeSnippet(node, code) {
    return normalizeCode(code.substring(node.range[0], node.range[1]));
}

async function analyzeDuplicateCode(filePath) {
    try {
        const code = await fs.readFile(filePath, "utf8");
        const ast = esprima.parseModule(code, { range: true, loc: true, tolerant: true });
        const blocks = getCodeBlocks(ast);

        const duplicates = [];
        const seenHashes = new Map();

        for (let i = 0; i < blocks.length; i++) {
            const block1 = blocks[i];
            const snippet1 = getCodeSnippet(block1, code);
            if (snippet1.length < 50) continue; // Ignore small blocks
            const hash1 = require("crypto").createHash("md5").update(snippet1).digest("hex");

            if (seenHashes.has(hash1)) {
                duplicates.push({
                    snippet: snippet1,
                    originalFile: seenHashes.get(hash1).file,
                    originalLine: seenHashes.get(hash1).line,
                    duplicateFile: filePath,
                    duplicateLine: block1.loc.start.line
                });
            } else {
                seenHashes.set(hash1, { file: filePath, line: block1.loc.start.line });
            }
        }
        return duplicates;
    } catch (err) {
        console.warn(`Erro ao analisar ${filePath}: ${err.message}`);
        return [];
    }
}

async function processDirectoryForDuplicates(dirPath) {
    let allDuplicates = [];
    try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile() && path.extname(filePath) === ".js") {
                const fileDuplicates = await analyzeDuplicateCode(filePath);
                allDuplicates = allDuplicates.concat(fileDuplicates);
            } else if (stats.isDirectory()) {
                allDuplicates = allDuplicates.concat(await processDirectoryForDuplicates(filePath));
            }
        }
    } catch (err) {
        console.warn(`Erro ao processar diretório ${dirPath}: ${err.message}`);
    }
    return allDuplicates;
}

async function findDuplicateCode(targetPath) {
    try {
        const stats = await fs.stat(targetPath);

        if (stats.isFile()) {
            if (path.extname(targetPath) !== ".js") {
                throw new Error("O arquivo deve ser um arquivo JavaScript.");
            }
            return await analyzeDuplicateCode(targetPath);
        } else if (stats.isDirectory()) {
            return await processDirectoryForDuplicates(targetPath);
        } else {
            throw new Error("O caminho especificado não é um arquivo ou diretório válido.");
        }
    } catch (err) {
        console.error(`Erro ao encontrar código duplicado: ${err.message}`);
        throw err;
    }
}

module.exports = { findDuplicateCode };