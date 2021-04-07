import _ from 'lodash';
import types from './types.js';

export default function compareTrees(nodeA, nodeB) {
  const keysA = Object.keys(nodeA || {});
  const keysB = Object.keys(nodeB || {});

  const keys = _.orderBy(_.union(keysA, keysB));

  const diffs = keys.map((key) => {
    const valueA = _.get(nodeA, key);
    const valueB = _.get(nodeB, key);

    if (_.has(nodeA, key) && !_.has(nodeB, key)) {
      return {
        key,
        value: valueA,
        type: types.removed,
      };
    }

    if (!_.has(nodeA, key) && _.has(nodeB, key)) {
      return {
        key,
        value: valueB,
        type: types.added,
      };
    }

    if (_.isPlainObject(valueA) && _.isPlainObject(valueB)) {
      return {
        key,
        value: compareTrees(valueA, valueB),
        type: types.nested,
      };
    }

    if (!_.isEqual(valueA, valueB)) {
      return {
        key,
        valueBefore: valueA,
        valueAfter: valueB,
        type: types.updated,
      };
    }

    return {
      key,
      value: valueA,
      type: types.unchanged,
    };
  });

  return diffs;
}
