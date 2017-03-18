import getRealPath from '../getRealPath';


export default function transformImport(t, nodePath, state) {
  const source = nodePath.get('source');
  if (source.type === 'StringLiteral') {
    const modulePath = getRealPath(source.node.value, state);
    if (modulePath) {
      source.replaceWith(t.stringLiteral(modulePath));
    }
  }
}
