const packageJson = require('./package.json')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const terser = require('rollup-plugin-terser').terser
const typescript = require('rollup-plugin-typescript')
// const commonjs = require('rollup-plugin-commonjs')

const deps = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
]

const inputOutputConfig = (outputFile, outputFormat, commonOutput = {}) => ({
  input: 'src/index.ts',
  output: {
    file: `${outputFile}`,
    format: outputFormat,
    ...commonOutput,
  },
})

const productionBuildPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  terser({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
      arguments: true,
      toplevel: true,
      unsafe_Function: true,
      module: true,
      unsafe_proto: true
    },
    mangle: {
      properties: {
        reserved: ['field', 'fieldArray', 'model', 'serializy']
      },
      module: true,
      toplevel: true
    }
  }),
]

module.exports = [
  // Common JS builds
  {
    ...inputOutputConfig('lib/serializy.js', 'cjs'),
    external: deps,
    plugins: [typescript()],
  },
  {
    ...inputOutputConfig('lib/serializy.min.js', 'cjs'),
    external: deps,
    plugins: [typescript(), ...productionBuildPlugins],
  },

  // EcmaScript builds
  {
    ...inputOutputConfig('es/serializy.js', 'es'),
    external: deps,
    plugins: [typescript()],
  },
  {
    ...inputOutputConfig('es/serializy.mjs', 'es'),
    external: deps,
    plugins: [
      resolve({
        jsnext: true,
      }),
      typescript(),
      ...productionBuildPlugins,
    ],
  },

  // UMD builds
  {
    ...inputOutputConfig('dist/serializy.js', 'umd', {
      name: 'serializy',
    }),
    external: deps,
    plugins: [
      resolve({
        jsnext: true,
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },
  {
    ...inputOutputConfig('dist/serializy.min.js', 'umd', {
      name: 'serializy',
    }),
    external: deps,
    plugins: [
      resolve({
        jsnext: true,
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
      ...productionBuildPlugins,
    ],
  },
]
