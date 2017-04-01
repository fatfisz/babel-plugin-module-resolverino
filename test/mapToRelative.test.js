import { resolve } from 'path';

import mapToRelative from 'mapToRelative';


describe('mapToRelative', () => {
  describe('should map to relative path with a custom cwd', () => {
    it('with a relative filename', () => {
      const currentFile = './utils/test/file.js';
      const result = mapToRelative(resolve('./test'), currentFile, 'utils/dep');

      expect(result).toBe('../dep');
    });

    it('with an absolute filename', () => {
      const currentFile = resolve('./utils/test/file.js');
      const result = mapToRelative(resolve('.'), currentFile, 'utils/dep');

      expect(result).toBe('../dep');
    });
  });
});
