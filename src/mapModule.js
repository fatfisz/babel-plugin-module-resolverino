import getRealPath from './getRealPath';


export default function mapModule(sourcePath, state) {
  const currentFile = state.file.opts.filename;
  const pluginOpts = state.opts;
  const cwd = state.moduleResolverCWD;

  return getRealPath(sourcePath, currentFile, {
    cwd,
    pluginOpts,
  });
}
