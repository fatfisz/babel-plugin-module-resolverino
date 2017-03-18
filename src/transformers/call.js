import mapModule from '../mapModule';
import { matchesPattern } from '../utils';


const patterns = [
  'require',
  'require.resolve',
  'System.import',
  'jest.genMockFromModule',
  'jest.mock',
  'jest.unmock',
  'jest.doMock',
  'jest.dontMock',
];

export default function transformCall(t, nodePath, state) {
  const calleePath = nodePath.get('callee');

  if (!patterns.some(pattern => matchesPattern(t, calleePath, pattern))) {
    return;
  }

  const args = nodePath.get('arguments');
  if (!args.length) {
    return;
  }

  const moduleArg = nodePath.get('arguments.0');
  if (moduleArg.type === 'StringLiteral') {
    // eslint-disable-next-line max-len
    const modulePath = mapModule(moduleArg.node.value, state.file.opts.filename, state.opts, state.moduleResolverCWD);
    if (modulePath) {
      moduleArg.replaceWith(t.stringLiteral(modulePath));
    }
  }
}
