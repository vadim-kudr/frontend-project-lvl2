import { test, expect } from '@jest/globals';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff, { compareNodes, compareTrees } from '../src/genDiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('format flat tree', () => {
  const valueA = 1;

  const valueB = undefined;

  const valueC = 2;

  test('exists in A', () => {
    const result = {
      key: 'a',
      value: 1,
      op: '-',
    };

    expect(compareNodes('a', valueA, valueB)).toEqual(result);
  });

  test('exists in B', () => {
    const result = {
      key: 'a',
      value: 1,
      op: '+',
    };

    expect(compareNodes('a', valueB, valueA)).toEqual(result);
  });

  test('equal', () => {
    const result = {
      key: 'a',
      value: 1,
      op: ' ',
    };

    expect(compareNodes('a', valueA, valueA)).toEqual(result);
  });

  test('not equal', () => {
    const result = [
      { key: 'a', op: '-', value: 1 },
      { key: 'a', op: '+', value: 2 },
    ];

    expect(compareNodes('a', valueA, valueC)).toEqual(result);
  });
});

describe('format nested tree', () => {
  const valueA = {
    b: 2,
  };

  const valueB = {};

  const valueC = {
    b: 3,
  };

  test('exists in A', () => {
    const result = [{ key: 'b', op: '-', value: 2 }];

    expect(compareTrees(valueA, valueB)).toEqual(result);
  });

  test('exists in B', () => {
    const result = [{ key: 'b', op: '+', value: 2 }];

    expect(compareTrees(valueB, valueA)).toEqual(result);
  });

  test('equal', () => {
    const result = [{ key: 'b', op: ' ', value: 2 }];

    expect(compareTrees(valueA, valueA)).toEqual(result);
  });

  test('not equal', () => {
    const result = [
      { key: 'b', op: '-', value: 2 },
      { key: 'b', op: '+', value: 3 },
    ];

    expect(compareTrees(valueA, valueC)).toEqual(result);
  });
});



describe('test diff', () => {
  test('one level json', () => {
    const filepath1 = getFixturePath('flat1.json');
    const filepath2 = getFixturePath('flat2.json');
    const diffFixture = readFile('flat_diff.txt');

    const diff = genDiff(filepath1, filepath2, 'stylish');
    expect(diff).toBe(diffFixture);
  });

  test('one level yml', () => {
    const filepath1 = getFixturePath('flat1.yml');
    const filepath2 = getFixturePath('flat2.yml');
    const diffFixture = readFile('flat_diff.txt');

    const diff = genDiff(filepath1, filepath2, 'stylish');
    expect(diff).toBe(diffFixture);
  });

  test('nested json', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    const diffFixture = readFile('nested_diff.txt');

    const diff = genDiff(filepath1, filepath2, 'stylish');
    expect(diff).toBe(diffFixture);
  });

  test('nested json plain', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    const diffFixture = readFile('nested_diff_plain.txt');

    const diff = genDiff(filepath1, filepath2, 'plain');
    expect(diff).toBe(diffFixture);
  });
});
