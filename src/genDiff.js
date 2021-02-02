import _ from 'lodash';
import { parseFile } from './parsers.js';
import getFormatter from './formatters/index.js';
import {
  EXISTS, ADDED, REMOVED, UPDATED,
} from './constants.js';

export function compareNodes(key, valueA, valueB) {
  if (valueA !== undefined && valueB === undefined) {
    return {
      key,
      value: valueA,
      op: REMOVED,
    };
  }

  if (valueA === undefined && valueB !== undefined) {
    return {
      key,
      value: valueB,
      op: ADDED,
    };
  }

  if (_.isEqual(valueA, valueB)) {
    return {
      key,
      value: valueA,
      op: EXISTS,
    };
  }

  return [
    {
      key,
      prevValue: valueA,
      value: valueB,
      op: UPDATED,
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
        op: EXISTS,
      };
    }

    return compareNodes(key, valueA, valueB);
  });

  return diffs;
}

export default function genDiff(filepath1, filepath2, formatName = 'stylish') {
  const fileA = parseFile(filepath1);
  const fileB = parseFile(filepath2);

  const diff = compareTrees(fileA, fileB);

  const formatter = getFormatter(formatName);
  return formatter(diff);
}
