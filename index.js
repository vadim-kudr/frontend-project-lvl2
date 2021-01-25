import _ from 'lodash';

export default function genDiff(jsonA, jsonB) {
  const keys = _.union(Object.keys(jsonA), Object.keys(jsonB)).sort();

  const diffs = keys.map(key => {
    const hasA = jsonA.hasOwnProperty(key);
    const hasB = jsonB.hasOwnProperty(key);

    const valueA = jsonA[key];
    const valueB = jsonB[key];

    if (valueA === valueB) {
      return `   ${key}: ${valueA}`;
    }

    if (hasA && !hasB) {
      return ` - ${key}: ${valueA}`;
    }

    if (!hasA && hasB) {
      return ` + ${key}: ${valueB}`;
    }

    return ` - ${key}: ${valueA}\n + ${key}: ${valueB}`
  });

  const diffResult = diffs.join('\n');

  return `{\n${diffResult}\n}`;
}