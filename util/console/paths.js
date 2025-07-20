const fs = require('fs');
const path = require('path');


function getResolverForRoot(root) {
    function resolver(...rest) {
        return path.resolve(root, ...rest);
    }
    return resolver;
}
class FileNotFoundError extends Error {}

function matchAllInFile(filePath, pattern, {encoding = 'utf8'} = {}) {
    const resolved = path.resolve(filePath);
    if(! resolved)
        throw new FileNotFoundError(`Can't find file "${filePath}"`);

    const text = fs.readFileSync(resolved, encoding);
    const matches = [...text.matchAll(pattern)];

    return {text, matches};
}

module.exports = {
    getResolverForRoot: getResolverForRoot,
    matchAllInFile: matchAllInFile
}