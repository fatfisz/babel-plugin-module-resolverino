import { basename, dirname, extname, join } from 'path';

import getRealPath from 'getRealPath';


export function toPosixPath(modulePath) {
  return modulePath.replace(/\\/g, '/');
}

export function toLocalPath(path) {
  return path
    .replace(/\/index$/, '') // remove trailing /index
    .replace(/^(?!\.)/, './'); // insert `./` to make it a local path
}

export function replaceExtension(path, ext) {
  const filename = basename(path, extname(path)) + ext;
  return join(dirname(path), filename);
}

export function matchesPattern(types, calleePath, pattern) {
  const { node } = calleePath;

  if (types.isMemberExpression(node)) {
    return calleePath.matchesPattern(pattern);
  }

  if (!types.isIdentifier(node) || pattern.includes('.')) {
    return false;
  }

  const name = pattern.split('.')[0];

  return node.name === name;
}

export function mapPathString(types, nodePath, state) {
  if (!types.isStringLiteral(nodePath)) {
    return;
  }

  const modulePath = getRealPath(nodePath.node.value, state);
  if (modulePath) {
    nodePath.replaceWith(types.stringLiteral(modulePath));
  }
}
