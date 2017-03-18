import getRealPath from './getRealPath';


export default function mapModule(sourcePath, state) {
  return getRealPath(sourcePath, state);
}
