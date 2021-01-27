import fs from 'fs';
import path from 'path';

import _ from 'lodash';

function readJsonFile(filepath) {
  const resolvedPath = path.resolve(filepath);
  const fileContent = fs.readFileSync(resolvedPath);

  return JSON.parse(fileContent);
}

export default function genDiff(filepath1, filepath2) {
  const jsonA = readJsonFile(filepath1);
  const jsonB = readJsonFile(filepath2);

  const prefix = '  ';
  const keys = _.union(Object.keys(jsonA), Object.keys(jsonB)).sort();

  const diffs = keys.map((key) => {
    /* eslint-disable no-prototype-builtins */
    const hasA = jsonA.hasOwnProperty(key);
    const hasB = jsonB.hasOwnProperty(key);
    /* eslint-disable no-prototype-builtins */

    const valueA = jsonA[key];
    const valueB = jsonB[key];

    if (valueA === valueB) {
      return `${prefix}  ${key}: ${valueA}`;
    }

    if (hasA && !hasB) {
      return `${prefix}- ${key}: ${valueA}`;
    }

    if (!hasA && hasB) {
      return `${prefix}+ ${key}: ${valueB}`;
    }

    return `${prefix}- ${key}: ${valueA}\n${prefix}+ ${key}: ${valueB}`;
  });

  const diffResult = diffs.join('\n');

  return `{\n${diffResult}\n}`;
}
