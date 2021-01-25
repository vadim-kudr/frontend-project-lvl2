#!/usr/bin/env node

import genDiff from '../index.js';

import commander from 'commander';
const { Command } = commander;

function parseCommandLine() {
  const program = new Command();

  program.version('0.0.1', '-V, --version', 'output the version number');

  program
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information');

  program.parse();
}

parseCommandLine();