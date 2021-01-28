import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function readFile(filepath) {
  const resolvedPath = path.resolve(filepath);
  return fs.readFileSync(resolvedPath, 'utf8');
}

/* eslint-disable import/prefer-default-export */
export function parseFile(filepath) {
  try {
    const content = readFile(filepath);
    const ext = path.extname(filepath);

    switch (ext) {
      case '.json': return JSON.parse(content);
      case '.yml': return yaml.load(content);
      default: return undefined;
    }
  } catch (error) {
    return undefined;
  }
}
