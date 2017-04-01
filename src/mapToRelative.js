import { dirname, normalize, relative, resolve } from 'path';

import { toPosixPath } from 'utils';


export default function mapToRelative(cwd, currentFile, module) {
  let from = dirname(currentFile);
  let to = normalize(module);

  from = resolve(cwd, from);
  to = resolve(cwd, to);

  const moduleMapped = relative(from, to);
  return toPosixPath(moduleMapped);
}
