import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const commonUmdOutput = {
  format: "umd",
  sourcemap: true,
  name: "VisibilitySensor",
  globals: {
    react: "React",
    "react-dom": "ReactDOM",
    "prop-types": "PropTypes"
  }
};

const commonPlugins = [
  peerDepsExternal(),
  resolve(),
  babel({
    exclude: "node_modules/**"
  }),
  commonjs()
];

export default [
  {
    input: "visibility-sensor.js",
    output: [
      { format: "cjs", file: pkg.main, sourcemap: true, exports: "named" },
      { format: "es", file: pkg.module, sourcemap: true },
      {
        ...commonUmdOutput,
        file: pkg.browser
      }
    ],
    plugins: commonPlugins
  },
  {
    input: "visibility-sensor.js",
    output: [
      {
        ...commonUmdOutput,
        file: "dist/visibility-sensor.min.js"
      }
    ],
    plugins: [...commonPlugins, terser()]
  }
];
