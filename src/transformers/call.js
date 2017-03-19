import { matchesPattern, mapPathString } from '../utils';

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

  mapPathString(t, nodePath.get('arguments.0'), state);
}
