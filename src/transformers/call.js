import getRealPath from '../getRealPath';
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
    const modulePath = getRealPath(moduleArg.node.value, state);
    if (modulePath) {
      moduleArg.replaceWith(t.stringLiteral(modulePath));
    }
  }
}
