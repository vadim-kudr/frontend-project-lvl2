import _ from 'lodash';
import { parseFile } from './parsers.js';
import stylishFormatter from './stylish.js';

export function compareNodes(key, valueA, valueB) {
  if (valueA !== undefined && valueB === undefined) {
    return {
      key,
      value: valueA,
      op: '-',
    };
  }

  if (valueA === undefined && valueB !== undefined) {
    return {
      key,
      value: valueB,
      op: '+',
    };
  }

  if (_.isEqual(valueA, valueB)) {
    return {
      key,
      value: valueA,
      op: ' ',
    };
  }

  return [
    {
      key,
      value: valueA,
      op: '-',
    },
    {
      key,
      value: valueB,
      op: '+',
    },
  ];
}

export function compareTrees(nodeA, nodeB) {
  const keysA = Object.keys(nodeA || {});
  const keysB = Object.keys(nodeB || {});

  const keys = _.union(keysA, keysB).sort();

  const diffs = keys.flatMap((key) => {
    const valueA = nodeA && nodeA[key];
    const valueB = nodeB && nodeB[key];

    const isTreeA = _.isObject(valueA);
    const isTreeB = _.isObject(valueB);

    if (isTreeA && isTreeB) {
      return {
        key,
        value: compareTrees(valueA, valueB),
        op: ' ',
      };
    }

    return compareNodes(key, valueA, valueB);
  });

  // console.log(JSON.stringify(diffs, null, 2));

  return diffs;
}

export default function genDiff(filepath1, filepath2) {
  const fileA = parseFile(filepath1);
  const fileB = parseFile(filepath2);

  const diff = compareTrees(fileA, fileB);

  // console.log(JSON.stringify(diff, null, 2));

  return stylishFormatter(diff);
}
