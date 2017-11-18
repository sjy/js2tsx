// rename file names
// Usage
// node ./rename.js $filepath
const fs = require('fs');
const [folder, originFileFormat = 'js', targetFileFormat = 'ts'] = process.argv.slice(2);
console.info(folder, originFileFormat, targetFileFormat);

const goodFiles = [];
function scanFolder(path) {
    const files = fs.readdirSync(path);
    files.forEach(f => {
        const subPath = [path, f].join('/');
        if (fs.lstatSync(subPath).isDirectory()) {
            scanFolder(subPath);
        } else {
            goodFiles.push(subPath);
        }
    });
}

scanFolder(folder);
goodFiles.filter(f => f.endsWith(originFileFormat)).forEach(ff =>
    fs.renameSync(
        ff,
        ff
            .split('.')
            .slice(0, -1)
            .concat([targetFileFormat])
            .join('.')
    )
);
