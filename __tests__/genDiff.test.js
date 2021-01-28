import { test, expect } from '@jest/globals';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import buildTree from '../src/buildTree.js';
import genDiff, { compareNodes } from '../src/genDiff';
import { parseFile } from '../src/parsers';
import stylishFormatter from '../src/stylish';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('build tree', () => {
  test('flat', () => {
    const file = parseFile(getFixturePath('flat1.json'));
    const result = parseFile(getFixturePath('parsed_flat_tree.json'));
    const tree = buildTree(file);

    expect(tree).toEqual(result);
  });

  test('nested', () => {
    const file = parseFile(getFixturePath('nested1.json'));
    const result = parseFile(getFixturePath('parsed_nested_tree.json'));
    const tree = buildTree(file);

    expect(tree).toEqual(result);
  });
});

describe('format flat tree', () => {
  const nodeA = {
    key: 'a',
    value: 1,
  };

  const nodeB = undefined;

  const nodeC = {
    key: 'a',
    value: 2,
  };

  test('exists in A', () => {
    const result = {
      key: 'a',
      value: 1,
      op: '-',
    };

    expect(compareNodes('a', nodeA, nodeB)).toEqual(result);
  });

  test('exists in B', () => {
    const result = {
      key: 'a',
      value: 1,
      op: '+',
    };

    expect(compareNodes('a', nodeB, nodeA)).toEqual(result);
  });

  test('equal', () => {
    const result = {
      key: 'a',
      value: 1,
      op: '=',
    };

    expect(compareNodes('a', nodeA, nodeA)).toEqual(result);
  });

  test('not equal', () => {
    const result = {
      key: 'a',
      value: {
        before: 1,
        after: 2,
      },
      op: '!=',
    };

    expect(compareNodes('a', nodeA, nodeC)).toEqual(result);
  });
});

describe('format nested tree', () => {
  const nodeA = {
    key: 'a',
    nested: true,
    value: [
      {
        key: 'b',
        value: 2,
      },
    ],
  };

  const nodeB = {
    key: 'a',
    nested: true,
    value: [],
  };

  const nodeC = {
    key: 'a',
    nested: true,
    value: [
      {
        key: 'b',
        value: 3,
      },
    ],
  };

  test('exists in A', () => {
    const result = {
      key: 'a',
      value: [{ key: 'b', value: 2, op: '-' }],
      op: '=',
    };

    expect(compareNodes('a', nodeA, nodeB)).toEqual(result);
  });

  test('exists in B', () => {
    const result = {
      key: 'a',
      value: [{ key: 'b', value: 2, op: '+' }],
      op: '=',
    };

    expect(compareNodes('a', nodeB, nodeA)).toEqual(result);
  });

  test('equal', () => {
    const result = {
      key: 'a',
      value: [{ key: 'b', value: 2, op: '=' }],
      op: '=',
    };

    expect(compareNodes('a', nodeA, nodeA)).toEqual(result);
  });

  test('not equal', () => {
    const result = {
      key: 'a',
      value: [
        {
          key: 'b',
          value: {
            before: 2,
            after: 3,
          },
          op: '!=',
        },
      ],
      op: '=',
    };

    expect(compareNodes('a', nodeA, nodeC)).toEqual(result);
  });
});

describe('test formatters', () => {
  test('stylish', () => {
    const tree = [{
      key: 'a',
      value: [
        {
          key: 'b',
          value: {
            before: 2,
            after: 3,
          },
          op: '!=',
        },
      ],
      op: '=',
    }];

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

describe('test diff', () => {
  test('one level json', () => {
    const filepath1 = getFixturePath('flat1.json');
    const filepath2 = getFixturePath('flat2.json');
    const diffFixture = readFile('flat_diff.txt');

    const diff = genDiff(filepath1, filepath2);
    expect(diff).toBe(diffFixture);
  });

  test('one level yml', () => {
    const filepath1 = getFixturePath('flat1.yml');
    const filepath2 = getFixturePath('flat2.yml');
    const diffFixture = readFile('flat_diff.txt');

    const diff = genDiff(filepath1, filepath2);
    expect(diff).toBe(diffFixture);
  });

  test('nested json', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    const diffFixture = readFile('nested_diff.txt');

    const diff = genDiff(filepath1, filepath2);
    expect(diff).toBe(diffFixture);
  });
});
