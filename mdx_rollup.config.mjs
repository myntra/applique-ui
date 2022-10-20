// requires node version 14.15 and above

import mdx from '@mdx-js/rollup'
import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import path from 'path'

import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function config(options) {
  return {
    input: options.input,
    external: ['react','react-dom'],
    plugins: [
      peerDepsExternal(),
      commonjs(),
      mdx({
        jsx: true,
      }),
      babel({
        babelHelpers: "bundled",
        extensions: ['.js', '.jsx', '.cjs', '.mjs', '.md', '.mdx', '.ts', '.tsx'],
        configFile: path.resolve(__dirname, 'mdx_babel.config.js')
      }),
    ],
  }
}

export default config
