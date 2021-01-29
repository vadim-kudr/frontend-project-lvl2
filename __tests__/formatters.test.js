import stylishFormatter from '../src/formatters/stylish';
import { flatTree } from '../src/formatters/plain';

describe('stylish formatter', () => {
  test('nested tree', () => {
    const tree = [
      {
        key: 'a',
        value: [
          {
            key: 'b',
            value: 2,
            op: '-',
          },
          {
            key: 'b',
            value: 3,
            op: '+',
          },
        ],
        op: ' ',
      },
    ];

    const result = [
      '{',
      '    a: {',
      '      - b: 2',
      '      + b: 3',
      '    }',
      '}',
    ].join('\n');

    const text = stylishFormatter(tree);
    expect(text).toEqual(result);
  });
});

describe('plain formatter', () => {
  test('flatTree: base operations', () => {
    const tree = [
      {
        key: 'a',
        value: 1,
        op: '-',
      },
      {
        key: 'a',
        value: 2,
        op: '+',
      },
      {
        key: 'b',
        value: 3,
        op: '+',
      },
    ];

    const result = [
      {
        key: 'a', op: 'u', value: 1, nextValue: 2,
      },
      { key: 'b', op: '+', value: 3 },
    ];

    const text = flatTree(tree);
    expect(text).toEqual(result);
  });

  test('flatTree: nested tree operations', () => {
    const tree = [
      {
        key: 'a',
        value: [
          {
            key: 'b',
            value: 2,
            op: '-',
          },
          {
            key: 'b',
            value: 3,
            op: '+',
          },
        ],
        op: ' ',
      },
      {
        key: 'c',
        value: 4,
        op: '+',
      },
    ];

    const result = [
      {
        key: 'a.b', op: 'u', value: 2, nextValue: 3,
      },
      { key: 'c', op: '+', value: 4 },
    ];

    const resultTree = flatTree(tree);
    expect(resultTree).toEqual(result);
  });
});
