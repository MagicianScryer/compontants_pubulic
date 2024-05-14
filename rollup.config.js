import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json'

import fs from 'fs-extra';
import path from 'path';

/*
const ONLY_ESM_ARRAY = [
  'ruibaireact.rbformcontext',
  'ruibaireact.rbmenuevent'
];*/
const ONLY_ESM_ARRAY = [];

let entries = [];
let core = {};

//let esModule = ['ruibaireact.rbformcontext', 'ruibaireact.rbhistory', 'ruibaireact.rbmenuevent']

const CFG_ENTRIES_BASIC = [
];

// ALIAS_COMPONENT_ENTRIES
const CFG_ENTRIES_COMPONENT = [
  ...CFG_ENTRIES_BASIC,
  { find: '../rbcontext/Rbcontext', replacement: 'ruibaireact/rbcontext' },
];

// GLOBAL_DEPENDENCIES
const CFG_DEPENDENCIES_GLOBAL = {
  'react': 'React',
  'react-dom': 'ReactDOM'
};

// GLOBAL_COMPONENT_DEPENDENCIES
const CFG_DEPENDENCIES_COMPONENT = {
  ...CFG_DEPENDENCIES_GLOBAL,
  ...(CFG_ENTRIES_COMPONENT.reduce(
    (acc, cur) => (
      {
        ...acc, [cur.replacement]: cur.replacement.replaceAll('/', '.')
      }
    ),
    {}
  )
  )
};

// EXTERNAL
const CFG_EXTERNAL = [
  'react',
  'react-dom'
];

// EXTERNAL_COMPONENT
const CFG_EXTERNAL_COMPONENT = [
  ...CFG_EXTERNAL,
  ...CFG_ENTRIES_COMPONENT.map(
    (entries) => entries.replacement
  )
];

// BABEL_PLUGIN_OPTIONS
const CFG_PLUGIN_OPTIONS_BABEL = {
  exclude: 'node_modules/**',
  presets: ["@babel/preset-env", '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [],
  skipPreflightCheck: true,
  babelHelpers: 'runtime',
  babelrc: false
};

// ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT
const CFG_ALIAS_PLUGIN_OPTIONS_COMPONENT = {
  entries: CFG_ENTRIES_COMPONENT
};

// REPLACE_PLUGIN_OPTIONS
const CFG_PLUGIN_OPTIONS_REPLACE = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  preventAssignment: true
};

// RESOLVE_PLUGIN_OPTIONS
const CFG_PLUGIN_OPTIONS_RESOLVE = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  main: true,
  browser: true,
  preferBuiltins: false
};

// COMMONJS_PLUGIN_OPTIONS
const CFG_PLUGIN_OPTIONS_COMMONJS = {
  exclude: process.env.INPUT_DIR + '**',
  include: [
    'node_modules/**/*.js'
  ],
  sourceMap: false
};

// POSTCSS_PLUGIN_OPTIONS
const CFG_PLUGIN_OPTIONS_POSTCSS = {
  sourceMap: false
};

// TERSER_PLUGIN_OPTIONS
const CFG_PLUGIN_OPTIONS_TERSER = {
  compress: {
    keep_infinity: true,
    pure_getters: true,
    reduce_funcs: false
  }
};

// PLUGINS
const CFG_PLUGIN = [
  replace(CFG_PLUGIN_OPTIONS_REPLACE),
  nodeResolve(CFG_PLUGIN_OPTIONS_RESOLVE),
  commonjs(CFG_PLUGIN_OPTIONS_COMMONJS),
  babel(CFG_PLUGIN_OPTIONS_BABEL),
  postcss(CFG_PLUGIN_OPTIONS_POSTCSS)
];

// PLUGINS_COMPONENT
const CFG_PLUGIN_COMPONENT = [
  alias(CFG_ALIAS_PLUGIN_OPTIONS_COMPONENT),
  ...CFG_PLUGIN
];

// addEntry
function BUILD_ENTRY(name, input, output, isComponent = true) {
  const exports = name === 'ruibaireact.api' || name === 'ruibaireact' ? 'named' : 'auto';
  const useCorePlugin = CFG_ENTRIES_COMPONENT.some((entry) => entry.replacement.replace('ruibaireact/', '') === name.replace('ruibaireact.', ''));
  const plugins = isComponent ? CFG_PLUGIN_COMPONENT : CFG_PLUGIN;
  const external = isComponent ? CFG_EXTERNAL_COMPONENT : CFG_EXTERNAL;
  const inlineDynamicImports = false;

  const onlyEsmFlag = ONLY_ESM_ARRAY.includes(name);

  // getEntry
  const loadEntry = (isMinify) => {
    return {
      input,
      plugins: [
        ...plugins,
        isMinify && terser(CFG_PLUGIN_OPTIONS_TERSER),
        useCorePlugin && BUILD_CORE_PLUGIN(),
        json()
      ],
      external
    };
  };

  // get_CJS_ESM
  // ESM输出的是值的引用，而CJS输出的是值的拷贝
  // CJS的输出是运行时加载，而ESM是编译时输出接口
  // CJS是同步加载，ESM是异步加载
  const loadCjsEsm = (isMinify) => {
    if (onlyEsmFlag) {
      return {
        ...loadEntry(isMinify),
        output: [
          inlineDynamicImports,
          {
            format: 'esm',
            file: `${output}.esm${isMinify ? '.min' : ''}.js`,
            exports
          }
        ]
      };
    } else {
      return {
        ...loadEntry(isMinify),
        output: [
          inlineDynamicImports,
          {
            format: 'cjs',
            file: `${output}.cjs${isMinify ? '.min' : ''}.js`,
            exports
          },
          {
            format: 'esm',
            file: `${output}.esm${isMinify ? '.min' : ''}.js`,
            exports
          }
        ]
      };
    }
  };

  // get_IIFE
  const loadIife = (isMinify) => {
    return {
      ...loadEntry(isMinify),
      output: [
        inlineDynamicImports,
        {
          format: 'iife',
          name,
          file: `${output}${isMinify ? '.min.js' : ''}.js`,
          globals: isComponent ? CFG_DEPENDENCIES_COMPONENT : CFG_DEPENDENCIES_GLOBAL,
          exports
        }
      ]
    };
  };

  entries.push(loadCjsEsm());
  !onlyEsmFlag && entries.push(loadIife());

  //Minify
  entries.push(loadCjsEsm(true));
  !onlyEsmFlag && entries.push(loadIife(true));
}

// corePlugin
function BUILD_CORE_PLUGIN() {
  return {
    name: 'BUILD_CORE_PLUGIN',
    generateBundle(outputOptions, bundle) {
      const { name, format } = outputOptions;

      if (format === 'iife') {
        Object.keys(bundle).forEach((id) => {
          const chunk = bundle[id];
          // const folderName = name.replace('ruibaireact.', '').replaceAll('.', '/');
          const folderName = id.replace('.min.js', '').replace('.js', '');
          const filePath = `./dist/core/core${id.indexOf('.min.js') > 0 ? '.min.js' : '.js'}`;

          core[filePath] ? (core[filePath][folderName] = chunk.code) : (core[filePath] = { [`${folderName}`]: chunk.code });
        });
      }
    }
  };
}

// addCore
function BUILD_CORE() {
  const lastEntry = entries[entries.length - 1];

  lastEntry.plugins = [
    ...lastEntry.plugins,
    {
      name: 'coreMergePlugin',
      generateBundle() {
        Object.entries(core).forEach(([filePath, value]) => {
          const code = CFG_ENTRIES_COMPONENT.reduce((val, entry) => {
            const name = entry.replacement.replace('ruibaireact/', '');

            val += value[name] + '\n';

            return val;
          }, '');

          fs.outputFile(path.resolve(__dirname, filePath), code, {}, function(err) {
            if (err) {
              // eslint-disable-next-line no-console
              return console.error(err);
            }
          });
        });
      }
    }
  ]
}

// addComponent
function BUILD_COMPONENT() {
  fs.readdirSync(path.resolve(__dirname, process.env.INPUT_DIR), { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      fs.readdirSync(path.resolve(__dirname, process.env.INPUT_DIR + folderName)).forEach(file => {
        let name = file.split(/(.js)$/)[0].toLowerCase();

        if (name === folderName) {
          const input = process.env.INPUT_DIR + folderName + '/' + file;
          const output = process.env.OUTPUT_DIR + folderName + '/' + name;

          BUILD_ENTRY('ruibaireact.' + folderName, input, output, true);
        }
      });
    });
}

function BUILD_RUIBAIREACT() {
  const input = process.env.INPUT_DIR + 'ruibaireact.all.js';
  const output = process.env.OUTPUT_DIR + 'ruibaireact.all';

  BUILD_ENTRY('ruibaireact', input, output, false);
}

BUILD_COMPONENT();
BUILD_RUIBAIREACT();
BUILD_CORE();

export default entries;
