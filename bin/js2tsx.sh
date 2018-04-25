#!/usr/bin/env node

var packageJson = require('../package.json');

var commander = require('commander');
var program = new commander.Command(packageJson.name)


console.log(process.argv)
program
  .version('1.0.1')
  .option(
    '-t, --template-engine [engine]',
    'Add template [engine] support',
    'jade'
  )
  .parse(process.argv);

  #  TODO
  #
