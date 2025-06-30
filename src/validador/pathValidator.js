// Versão corrigida e assíncrona do pathValidator.js
const fs = require('fs').promises; // Usando a versão baseada em Promises
const path = require('path');

async function processPath(filePath, processFile, aggregateResults) {
    async function walk(currentPath) {
        const stats = await fs.stat(currentPath);

        if (stats.isDirectory()) {
            const files = await fs.readdir(currentPath);
            const results = await Promise.all(
                files.map(file => walk(path.join(currentPath, file)))
            );
            // Filtra resultados vazios (de arquivos não-js) e "achata" a lista
            return results.flat().filter(Boolean);
        }

        if (path.extname(currentPath) === '.js') {
            return processFile(currentPath);
        }

        return null; // Retorna nulo para arquivos que não são .js
    }

    const results = await walk(filePath);
    return aggregateResults(results.flat().filter(Boolean));
}

module.exports = { processPath };
