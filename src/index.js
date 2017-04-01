import fs from 'fs';
import { dirname } from 'path';

import findBabelConfig from 'find-babel-config';
import glob from 'glob';

import transformCall from 'transformers/call';
import transformImport from 'transformers/import';


const defaultExtensions = ['.js', '.jsx', '.es', '.es6'];

function isRegExp(string) {
  return string.startsWith('^') || string.endsWith('$');
}

function normalizeCwd(file) {
  const { opts } = this;

  if (opts.cwd === 'babelrc') {
    const startPath = (file.opts.filename === 'unknown')
      ? './'
      : file.opts.filename;

    const { file: babelPath } = findBabelConfig.sync(startPath);

    opts.cwd = babelPath
      ? dirname(babelPath)
      : null;
  }

  if (!opts.cwd) {
    opts.cwd = process.cwd();
  }
}

function normalizePluginOptions(file) {
  const { opts } = this;

  normalizeCwd.call(this, file);

  if (opts.root) {
    opts.root = opts.root.reduce((resolvedDirs, dirPath) => {
      if (glob.hasMagic(dirPath)) {
        const roots = glob.sync(dirPath)
          .filter(path => fs.lstatSync(path).isDirectory());

        return [...resolvedDirs, ...roots];
      }

      return [...resolvedDirs, dirPath];
    }, []);
  } else {
    opts.root = [];
  }

  opts.regExps = [];

  if (opts.alias) {
    Object.keys(opts.alias)
      .filter(isRegExp)
      .forEach((key) => {
        const parts = opts.alias[key].split('\\\\');

        function substitute(execResult) {
          return parts
            .map(part =>
              part.replace(/\\\d+/g, number => execResult[number.slice(1)] || ''),
            )
            .join('\\');
        }

        opts.regExps.push([new RegExp(key), substitute]);

        delete opts.alias[key];
      });
  } else {
    opts.alias = {};
  }

  if (!opts.extensions) {
    opts.extensions = defaultExtensions;
  }

  return opts;
}

export default ({ types }) => {
  const importVisitors = {
    CallExpression(nodePath, state) {
      transformCall(types, nodePath, state);
    },
    ImportDeclaration(nodePath, state) {
      transformImport(types, nodePath, state);
    },
    ExportDeclaration(nodePath, state) {
      transformImport(types, nodePath, state);
    },
  };

  return {
    pre: normalizePluginOptions,

    visitor: {
      Program: {
        exit(programPath, state) {
          programPath.traverse(importVisitors, state);
        },
      },
    },
  };
};
