import mapModule from '../mapModule';


export default function transformImport(t, nodePath, state, cwd) {
  const source = nodePath.get('source');
  if (source.type === 'StringLiteral') {
    const modulePath = mapModule(source.node.value, state.file.opts.filename, state.opts, cwd);
    if (modulePath) {
      source.replaceWith(t.stringLiteral(modulePath));
    }
  }
}
