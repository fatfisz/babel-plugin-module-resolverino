import path from 'path';
import fs from 'fs';
import glob from 'glob';
import findBabelConfig from 'find-babel-config';
import transformImport from './transformers/import';
import transformCall from './transformers/call';


const defaultBabelExtensions = ['.js', '.jsx', '.es', '.es6'];
export const defaultExtensions = defaultBabelExtensions;

function isRegExp(string) {
  return string.startsWith('^') || string.endsWith('$');
}

export function manipulatePluginOptions(pluginOpts) {
  if (pluginOpts.root) {
    // eslint-disable-next-line no-param-reassign
    pluginOpts.root = pluginOpts.root.reduce((resolvedDirs, dirPath) => {
      if (glob.hasMagic(dirPath)) {
        return resolvedDirs.concat(
          glob.sync(dirPath).filter(p => fs.lstatSync(p).isDirectory()),
        );
      }
      return resolvedDirs.concat(dirPath);
    }, []);
  } else {
    // eslint-disable-next-line no-param-reassign
    pluginOpts.root = [];
  }

  // eslint-disable-next-line no-param-reassign
  pluginOpts.regExps = [];

  if (pluginOpts.alias) {
    Object.keys(pluginOpts.alias)
      .filter(isRegExp)
      .forEach((key) => {
        const parts = pluginOpts.alias[key].split('\\\\');

        function substitute(execResult) {
          return parts
            .map(part =>
              part.replace(/\\\d+/g, number => execResult[number.slice(1)] || ''),
            )
            .join('\\');
        }

        pluginOpts.regExps.push([new RegExp(key), substitute]);

        // eslint-disable-next-line no-param-reassign
        delete pluginOpts.alias[key];
      });
  } else {
    // eslint-disable-next-line no-param-reassign
    pluginOpts.alias = {};
  }

  if (!pluginOpts.extensions) {
    // eslint-disable-next-line no-param-reassign
    pluginOpts.extensions = defaultExtensions;
  }

  return pluginOpts;
}

export default ({ types: t }) => {
  const importVisitors = {
    CallExpression(nodePath, state) {
      transformCall(t, nodePath, state);
    },
    ImportDeclaration(nodePath, state) {
      transformImport(t, nodePath, state);
    },
    ExportDeclaration(nodePath, state) {
      transformImport(t, nodePath, state);
    },
  };

  return {
    manipulateOptions(babelOptions) {
      let findPluginOptions = babelOptions.plugins.find(plugin => plugin[0] === this)[1];
      findPluginOptions = manipulatePluginOptions(findPluginOptions);

      this.customCWD = findPluginOptions.cwd;
    },

    pre(file) {
      let { customCWD } = this.plugin;
      if (customCWD === 'babelrc') {
        const startPath = (file.opts.filename === 'unknown')
          ? './'
          : file.opts.filename;

        const { file: babelFile } = findBabelConfig.sync(startPath);
        customCWD = babelFile
          ? path.dirname(babelFile)
          : null;
      }

      this.cwd = customCWD || process.cwd();
    },

    visitor: {
      Program: {
        exit(programPath, state) {
          programPath.traverse(importVisitors, state);
        },
      },
    },
  };
};
