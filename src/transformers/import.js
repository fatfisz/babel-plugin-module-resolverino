import { mapPathString } from '../utils';

export default function transformImport(t, nodePath, state) {
  mapPathString(t, nodePath.get('source'), state);
}
