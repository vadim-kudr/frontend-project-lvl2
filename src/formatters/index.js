import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

export default function getFormatter(formatName) {
  switch (formatName) {
    case 'stylish': return stylishFormatter;
    case 'plain': return plainFormatter;
    case 'json': return (tree) => JSON.stringify(tree, null, 2);
    default: throw new Error(`non supported formatter ${formatName}`);
  }
}
