import yaml from 'js-yaml';

export default function parse(data, format) {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.load(data);
    default:
      throw new Error(`non supported format ${format}`);
  }
}
