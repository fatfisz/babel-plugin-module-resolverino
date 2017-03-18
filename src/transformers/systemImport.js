export default function transformSystemImportCall(t, nodePath, mapper, state, cwd) {
  const calleePath = nodePath.get('callee');

  if (!calleePath.matchesPattern('System.import')) {
    return;
  }

  const args = nodePath.get('arguments');
  if (!args.length) {
    return;
  }

  const moduleArg = args[0];
  if (moduleArg.node.type === 'StringLiteral') {
    const modulePath = mapper(moduleArg.node.value, state.file.opts.filename, state.opts, cwd);
    if (modulePath) {
      nodePath.get('arguments.0').replaceWith(t.stringLiteral(modulePath));
    }
  }
}
