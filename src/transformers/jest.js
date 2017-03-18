import { matchesPattern } from '../utils';


export default function transformJestCalls(t, nodePath, mapper, state, cwd) {
  const calleePath = nodePath.get('callee');

  const jestMethods = [
    'genMockFromModule',
    'mock',
    'unmock',
    'doMock',
    'dontMock',
  ];

  if (!jestMethods.some(methodName => matchesPattern(t, calleePath, `jest.${methodName}`))) {
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
