import { test, expect, beforeAll } from '@jest/globals';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/genDiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = ['stylish', 'plain', 'json'];
const extensions = ['json', 'yml'];

const fileContent = {};

const table = extensions.flatMap(
  (extension) => formats.map((format) => [extension, format]),
);

beforeAll(() => {
  formats.forEach((format) => {
    /* eslint-disable fp/no-mutation */
    fileContent[format] = readFile(`result_${format}.txt`);
  });
});

test.each(table)('test .%s formatted as %s', (extension, format) => {
  const filepath1 = getFixturePath(`file1.${extension}`);
  const filepath2 = getFixturePath(`file2.${extension}`);

  const diff = genDiff(filepath1, filepath2, format);
  expect(diff).toEqual(fileContent[format]);
});
