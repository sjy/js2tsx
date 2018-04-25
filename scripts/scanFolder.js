const fs = require('fs');

function scanFolder(path) {
  const files = fs.readdirSync(path);
  return files
    .map(f => {
      const subPath = [path, f].join('/');
      if (fs.lstatSync(subPath).isDirectory()) {
        return scanFolder(subPath);
      } else {
        return [subPath];
      }
    })
    .reduce((a, b) => a.concat(b), []);
}

module.exports = scanFolder;
