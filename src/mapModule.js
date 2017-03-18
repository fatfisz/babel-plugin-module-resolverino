import getRealPath from './getRealPath';


const defaultBabelExtensions = ['.js', '.jsx', '.es', '.es6'];
const defaultExtensions = defaultBabelExtensions;

export default function mapModule(sourcePath, currentFile, pluginOpts, cwd) {
  return getRealPath(sourcePath, currentFile, {
    cwd,
    pluginOpts,
    extensions: pluginOpts.extensions || defaultExtensions,
  });
}
