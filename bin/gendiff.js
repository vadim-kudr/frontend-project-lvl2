#!/usr/bin/env node

import commander from 'commander';
import genDiff from '../index.js';

const { Command } = commander;

const parseCommandLine = () => {
  const program = new Command();

  program.version('0.0.1', '-V, --version', 'output the version number');

  program
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format', 'stylish')
    .action((filepath1, filepath2) => {
      const { format } = program.opts();

      const diff = genDiff(filepath1, filepath2, format);

      console.log(diff);
    });

  program.parse(process.argv);
};

parseCommandLine();
