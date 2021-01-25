#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import genDiff from '../index.js';

import commander from 'commander';
const { Command } = commander;

function readJsonFile(filepath) {
  const resolvedPath = path.resolve(filepath);
  const fileContent = fs.readFileSync(resolvedPath);

  return JSON.parse(fileContent);
}

function parseCommandLine() {
  const program = new Command();

  program.version('0.0.1', '-V, --version', 'output the version number');

  program
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')
    .action((filepath1, filepath2) => {
      const json1 = readJsonFile(filepath1);
      const json2 = readJsonFile(filepath2);

      const diff = genDiff(json1, json2);

      console.log(diff);
    });

  program.parse();
}

parseCommandLine();