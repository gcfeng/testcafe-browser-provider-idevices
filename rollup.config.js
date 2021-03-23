import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(/^[^0-9]*/, '');

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return id => pattern.test(id);
};

export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: {
      exports: 'auto',
      file: 'lib/index.js',
      format: 'cjs',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
    ]),
    plugins: [
      nodeResolve(),
      babel({
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]],
        babelHelpers: 'runtime'
      })
    ]
  },
  // ES
  {
    input: 'src/index.js',
    output: {
      file: 'es/index.js',
      format: 'es',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
    ]),
    plugins: [
      nodeResolve(),
      babel({
        plugins: [
          ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion, useESModules: true }],
        ],
        babelHelpers: 'runtime'
      }),
    ],
  },
];
