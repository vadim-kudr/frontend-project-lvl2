const isVisibleOp = (op) => op !== '=' && op !== '!=' && op !== undefined;

function buildString(key, op, value, level) {
  const prefix = '  '.repeat(level);
  const newOp = isVisibleOp(op) ? op : ' ';
  const valuePrefix = value !== '' ? ' ' : '';

  return `${prefix}${newOp} ${key}:${valuePrefix}${value}`;
}

function formatTreeNode(node, key = '', op = ' ', level = 0) {
  if (!Array.isArray(node)) {
    return buildString(key, op, node, level);
  }

  const isSubTree = !!key;
  const nextLevel = level + (isSubTree ? 2 : 1);

  const diffs = node.reduce((acc, item) => {
    const { key, op, value } = item;

    if (Array.isArray(value)) {
      return acc.concat(formatTreeNode(value, key, op, nextLevel));
    }

    if (op === '!=') {
      const { before, after } = value;

      const beforeDiffs = formatTreeNode(before, key, '-', nextLevel);
      const afterDiffs = formatTreeNode(after, key, '+', nextLevel);

      return acc.concat(beforeDiffs, afterDiffs);
    }

    return acc.concat(buildString(key, op, value, nextLevel));
  }, []);

  if (isSubTree) {
    const prefix = '  '.repeat(level);
    const newOp = isVisibleOp(op) ? op : ' ';
    return [
      `${prefix}${newOp} ${key}: {`,
      ...diffs,
      `${prefix}  }`,
    ];
  }

  return diffs;
}

export default function stylishFormatter(diff) {
  const diffs = formatTreeNode(diff);

  return [
    '{',
    ...diffs,
    '}',
  ].join('\n');
}
