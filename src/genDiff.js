import _ from 'lodash';
import { parseFile } from './parsers.js';

export default function genDiff(filepath1, filepath2) {
  const fileA = parseFile(filepath1);
  const fileB = parseFile(filepath2);

  const prefix = '  ';
  const keys = _.union(Object.keys(fileA), Object.keys(fileB)).sort();

  const diffs = keys.map((key) => {
    /* eslint-disable no-prototype-builtins */
    const hasA = fileA.hasOwnProperty(key);
    const hasB = fileB.hasOwnProperty(key);
    /* eslint-disable no-prototype-builtins */

    const valueA = fileA[key];
    const valueB = fileB[key];

    if (hasA && !hasB) {
      return `${prefix}- ${key}: ${valueA}`;
    }

    if (!hasA && hasB) {
      return `${prefix}+ ${key}: ${valueB}`;
    }

    if (valueA === valueB) {
      return `${prefix}  ${key}: ${valueA}`;
    }

    return `${prefix}- ${key}: ${valueA}\n${prefix}+ ${key}: ${valueB}`;
  });

  const diffResult = diffs.join('\n');

  return `{\n${diffResult}\n}`;
}
