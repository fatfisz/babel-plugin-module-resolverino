import fs from 'fs';

import builtinModules from 'builtin-modules';
import babel from 'rollup-plugin-babel';


const packageConfig = JSON.parse(fs.readFileSync('./package.json'));
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));

babelConfig.babelrc = false;
const envPreset = babelConfig.presets
  .find(preset => Array.isArray(preset) && preset[0] === 'env');
envPreset[1].modules = false;


const external = [].concat(
  builtinModules,
  Object.keys(packageConfig.dependencies)
);

export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'lib/index.js',
  plugins: [babel(babelConfig)],
  interop: false,
  external,
};
