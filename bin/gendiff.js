#!/usr/bin/env node

import commander from 'commander';
import genDiff from '../index.js';

const { Command } = commander;

function parseCommandLine() {
  const program = new Command();

  program.version('0.0.1', '-V, --version', 'output the version number');

  program
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')
    .action((filepath1, filepath2) => {
      const diff = genDiff(filepath1, filepath2);

      console.log(diff);
    });

  program.parse();
}

parseCommandLine();
