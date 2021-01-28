import _ from 'lodash';
import { parseFile } from './parsers.js';
import buildTree from './buildTree.js';
import stylishFormatter from './stylish.js';

function formatNodeValue(node) {
  const { nested, value } = node;

  if (nested) {
    return compareTrees(node.value, node.value);
  }

  return value;
}

export function compareNodes(key, nodeA, nodeB) {
  const { nested: nestedA, value: valueA } = nodeA || {};
  const { nested: nestedB, value: valueB } = nodeB || {};

  if (nestedA && nestedB) {
    return {
      key,
      value: compareTrees(valueA, valueB),
      op: '=',
    };
  }

  if (nodeA && nodeB === undefined) {
    return {
      key,
      value: formatNodeValue(nodeA),
      op: '-',
    };
  }

  if (nodeA === undefined && nodeB) {
    return {
      key,
      value: formatNodeValue(nodeB),
      op: '+',
    };
  }

  if (_.isEqual(nodeA, nodeB)) {
    return {
      key,
      value: valueA,
      op: '=',
    };
  }

  return {
    key,
    value: {
      before: valueA,
      after: valueB,
    },
    op: '!=',
  };
}

export function compareTrees(nodeA, nodeB) {
  const keysA = nodeA.map((node) => node.key);
  const keysB = nodeB.map((node) => node.key);

  const keys = _.union(keysA, keysB).sort();

  const diffs = keys.map((key) => {
    const valueA = nodeA.find((node) => node.key === key);
    const valueB = nodeB.find((node) => node.key === key);

    return compareNodes(key, valueA, valueB);
  });

  return diffs;
}

export default function genDiff(filepath1, filepath2) {
  const fileA = parseFile(filepath1);
  const fileB = parseFile(filepath2);

  const treeA = buildTree(fileA);
  const treeB = buildTree(fileB);

  const diff = compareTrees(treeA, treeB);

  console.log(JSON.stringify(diff, null, 2));

  return stylishFormatter(diff);
}
