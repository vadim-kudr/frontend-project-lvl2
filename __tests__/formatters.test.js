import stylishFormatter from '../src/formatters/stylish';
import { flatDiffs } from '../src/formatters/plain';
import {
  EXISTS, ADDED, UPDATED,
} from '../src/constants.js';

describe('stylish formatter', () => {
  test('nested tree', () => {
    const tree = [
      {
        key: 'a',
        value: [
          {
            key: 'b',
            value: 3,
            prevValue: 2,
            op: UPDATED,
          },
          {
            key: 'd',
            value: {
              e: 4,
            },
            op: ADDED,
          },
        ],
        op: EXISTS,
      },
    ];

    const result = [
      '{',
      '    a: {',
      '      - b: 2',
      '      + b: 3',
      '      + d: {',
      '            e: 4',
      '        }',
      '    }',
      '}',
    ].join('\n');

    const text = stylishFormatter(tree);
    expect(text).toEqual(result);
  });
});

describe('plain formatter', () => {
  test('flatDiffs: base operations', () => {
    const tree = [
      {
        key: 'a',
        value: 2,
        prevValue: 1,
        op: UPDATED,
      },
      {
        key: 'b',
        value: 3,
        op: ADDED,
      },
    ];

    const result = [
      {
        key: 'a', op: UPDATED, value: 2, prevValue: 1,
      },
      { key: 'b', op: ADDED, value: 3 },
    ];

    const text = flatDiffs(tree);
    expect(text).toEqual(result);
  });

  test('flatDiffs: nested tree operations', () => {
    const tree = [
      {
        key: 'a',
        value: [
          {
            key: 'b',
            value: 3,
            prevValue: 2,
            op: UPDATED,
          },
        ],
        op: EXISTS,
      },
      {
        key: 'c',
        value: 4,
        op: ADDED,
      },
    ];

    const result = [
      {
        key: 'a.b', op: UPDATED, value: 3, prevValue: 2,
      },
      { key: 'c', op: ADDED, value: 4 },
    ];

    const resultTree = flatDiffs(tree);
    expect(resultTree).toEqual(result);
  });
});
