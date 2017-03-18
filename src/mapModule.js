import getRealPath from './getRealPath';


const defaultBabelExtensions = ['.js', '.jsx', '.es', '.es6'];
const defaultExtensions = defaultBabelExtensions;

export default function mapModule(sourcePath, state) {
  const currentFile = state.file.opts.filename;
  const pluginOpts = state.opts;
  const cwd = state.moduleResolverCWD;

  return getRealPath(sourcePath, currentFile, {
    cwd,
    pluginOpts,
    extensions: pluginOpts.extensions || defaultExtensions,
  });
}
