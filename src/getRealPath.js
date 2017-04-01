import { extname, resolve } from 'path';

import requireResolve from 'resolve';

import mapToRelative from 'mapToRelative';
import { toLocalPath, toPosixPath, replaceExtension } from 'utils';


function findPathInRoots(sourcePath, { extensions, root }) {
  let resolvedSourceFile;

  root.some((basedir) => {
    try {
      // Check if the file exists (will throw if not)
      resolvedSourceFile = requireResolve.sync(`./${sourcePath}`, {
        basedir,
        extensions,
      });
      return true;
    } catch (e) {
      return false;
    }
  });

  return resolvedSourceFile;
}

function getRealPathFromRootConfig(sourcePath, currentFile, opts) {
  const absFileInRoot = findPathInRoots(sourcePath, opts);

  if (!absFileInRoot) {
    return null;
  }

  const realSourceFileExtension = extname(absFileInRoot);
  const sourceFileExtension = extname(sourcePath);

  // Map the source and keep its extension if the import/require had one
  const ext = realSourceFileExtension === sourceFileExtension ? realSourceFileExtension : '';
  return toLocalPath(toPosixPath(replaceExtension(
    mapToRelative(opts.cwd, currentFile, absFileInRoot),
    ext,
  )));
}

function getRealPathFromAliasConfig(sourcePath, currentFile, opts) {
  let aliasedSourceFile;

  opts.alias.find(([regExp, substitute]) => {
    const execResult = regExp.exec(sourcePath);

    if (execResult === null) {
      return false;
    }

    aliasedSourceFile = substitute(execResult);
    return true;
  });

  if (!aliasedSourceFile) {
    return null;
  }

  if (aliasedSourceFile[0] === '.') {
    return aliasedSourceFile;
  }

  const realPathFromRoot = getRealPathFromRootConfig(aliasedSourceFile, currentFile, opts);
  if (realPathFromRoot) {
    return realPathFromRoot;
  }

  return aliasedSourceFile;
}

export default function getRealPath(sourcePath, { file, opts }) {
  if (sourcePath[0] === '.') {
    return sourcePath;
  }

  // File param is a relative path from the environment current working directory
  // (not from cwd param)
  const currentFile = resolve(file.opts.filename);

  const sourceFileFromRoot = getRealPathFromRootConfig(sourcePath, currentFile, opts);
  if (sourceFileFromRoot) {
    return sourceFileFromRoot;
  }

  const sourceFileFromAlias = getRealPathFromAliasConfig(sourcePath, currentFile, opts);
  if (sourceFileFromAlias) {
    return sourceFileFromAlias;
  }

  return sourcePath;
}
