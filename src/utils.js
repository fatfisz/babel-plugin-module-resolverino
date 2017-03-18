import path from 'path';

export function toPosixPath(modulePath) {
  return modulePath.replace(/\\/g, '/');
}

export function toLocalPath(p) {
  return p
    .replace(/\/index$/, '') // remove trailing /index
    .replace(/^(?!\.)/, './'); // insert `./` to make it a local path
}

export function replaceExtension(p, ext) {
  const filename = path.basename(p, path.extname(p)) + ext;
  return path.join(path.dirname(p), filename);
}

export function matchesPattern(t, calleePath, pattern, allowPartial) {
  const { node } = calleePath;

  if (t.isMemberExpression(node)) {
    return calleePath.matchesPattern(pattern, allowPartial);
  }

  if (
    !t.isIdentifier(node) ||
    (pattern.includes('.') && !allowPartial)
  ) {
    return false;
  }

  const name = pattern.split('.')[0];

  return node.name === name;
}
