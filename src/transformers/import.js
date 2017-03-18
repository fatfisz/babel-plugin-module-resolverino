import mapModule from '../mapModule';


export default function transformImport(t, nodePath, state) {
  const source = nodePath.get('source');
  if (source.type === 'StringLiteral') {
    // eslint-disable-next-line max-len
    const modulePath = mapModule(source.node.value, state.file.opts.filename, state.opts, state.moduleResolverCWD);
    if (modulePath) {
      source.replaceWith(t.stringLiteral(modulePath));
    }
  }
}
