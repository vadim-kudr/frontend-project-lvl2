import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';
import compareTrees from './compareTrees.js';

const getFileExtention = (filepath) => path.extname(filepath).slice(1);

const readFile = (filepath) => {
  const resolvedPath = path.resolve(filepath);
  return fs.readFileSync(resolvedPath, 'utf8');
};

export default function genDiff(filepath1, filepath2, formatName = 'stylish') {
  const fileA = readFile(filepath1);
  const fileB = readFile(filepath2);
  const dataA = parse(fileA, getFileExtention(filepath1));
  const dataB = parse(fileB, getFileExtention(filepath2));

  const diff = compareTrees(dataA, dataB);

  const formatter = getFormatter(formatName);
  return formatter(diff);
}
