export default function buildTree(node) {
  const keys = Object.keys(node);

  return keys.map((key) => {
    const value = node[key];

    if (typeof value === 'object' && value !== null) {
      return {
        key,
        nested: true,
        value: buildTree(value),
      };
    }

    return {
      key,
      value,
    };
  });
}
