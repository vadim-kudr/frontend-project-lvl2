import _ from 'lodash';
import { types } from './constants.js';

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
        operator: types.removed,
      };
    }

    if (!_.has(nodeA, key) && _.has(nodeB, key)) {
      return {
        key,
        value: valueB,
        operator: types.added,
      };
    }

    if (_.isPlainObject(valueA) && _.isPlainObject(valueB)) {
      return {
        key,
        value: compareTrees(valueA, valueB),
        operator: types.nested,
      };
    }

    if (!_.isEqual(valueA, valueB)) {
      return {
        key,
        prevValue: valueA,
        value: valueB,
        operator: types.updated,
      };
    }

    return {
      key,
      value: valueA,
      operator: types.unchanged,
    };
  });

  return diffs;
}
