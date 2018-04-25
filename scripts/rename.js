/**
 * @author sjy
 * @argument folderpath sourceFileExtension targetFileExtension
 *
 *
 * rename file names
 * node >= 4.0
 */

const fs = require('fs');
const scanFolder = require('./scanFolder');

function rename(sourceFolde, sourceExt = 'js', targetExt = 'ts') {
  if (sourceFolde === undefined) {
    console.error('Source Folder Path is Required !');
    process.exit(1);
  }

  console.info(sourceFolde, sourceExt, targetExt);

  var goodFiles = scanFolder(sourceFolde);
  goodFiles.filter(f => f.endsWith(sourceExt)).forEach(ff =>
    fs.renameSync(
      ff,
      ff
        .split('.')
        .slice(0, -1)
        .concat([targetExt])
        .join('.')
    )
  );

  process.exit(0);
}

module.exports = rename;
