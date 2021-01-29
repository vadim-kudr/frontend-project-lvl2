import _ from 'lodash';

function makeValueString(value) {
  if (_.isObject(value) || _.isArray(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
}

function makeOperationDesc(op, value, nextValue) {
  switch (op) {
    case '+': return `added with value: ${makeValueString(value)}`;
    case '-': return 'removed';
    case 'u': {
      const before = makeValueString(value);
      const after = makeValueString(nextValue);
      return `updated. From ${before} to ${after}`;
    }
    default: return null;
  }
}

function makeOperationString(operation) {
  const {
    key, op, value, nextValue,
  } = operation;

  const desc = makeOperationDesc(op, value, nextValue);
  if (!desc) {
    return null;
  }
  return `Property '${key}' was ${desc}`;
}

const getKeyPath = (path, key) => (path ? `${path}.${key}` : key);

export function flatTree(tree, path = '') {
  return tree.reduce((acc, node, index) => {
    const { key, op, value } = node;
    const { key: prevKey, op: prevOp } = tree[index - 1] || {};

    const keyPath = getKeyPath(path, key);
    const prevKeyPath = getKeyPath(path, prevKey);

    if (_.isArray(value)) {
      const subTree = flatTree(value, keyPath);
      return acc.concat(subTree);
    }

    const isUpdate = prevKeyPath === keyPath && prevOp === '-' && op === '+';
    if (isUpdate) {
      const lastItem = acc[acc.length - 1];
      lastItem.op = 'u';
      lastItem.nextValue = value;
      return acc;
    }

    acc.push({
      key: keyPath,
      op,
      value,
    });

    return acc;
  }, []);
}

export default function plainFormatter(tree) {
  const resultTree = flatTree(tree);

  return resultTree
    .map((operation) => makeOperationString(operation))
    .filter(Boolean)
    .join('\n');
}
