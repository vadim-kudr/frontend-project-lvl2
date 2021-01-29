import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

export default function getFormatter(formatName) {
  switch (formatName) {
    case 'stylish': return stylishFormatter;
    case 'plain': return plainFormatter;
    default: throw new Error(`non supported format ${formatName}`);
  }
}
