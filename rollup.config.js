import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

const packageJson = require('./package.json');

const extensions = ['.js', '.jsx'];

export default {
  input: 'libIndex.js',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    // js build process
    external(),
    resolve({
      mainFields: ['module', 'main', 'jsnext:main', 'browser'],
      extensions,
    }),
    commonjs(),
    postcss(),
    babel({ extensions, runtimeHelpers: true }),
    terser(),
    // copy useful example files (e.g., css)
    copy({
      targets: [{ src: 'src/styles/*', dest: 'dist/styles' }],
    }),
  ],
};
