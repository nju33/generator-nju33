import Case from 'case';
import ora from 'ora';
import meow from 'meow';
import chokidar from 'chokidar';
import debounce from 'lodash/debounce';
import pkg from './package';
import {data, construction} from './tasks/injector';
import server from './tasks/server';
import style from './tasks/style';
import script from './tasks/script';

const cli = meow(`
  Usage
    $ yarn build
`, {
  alias: {
    w: 'watch'
  }
});

data.set({
  name: pkg.name,
  moduleName: Case.pascal(pkg.name),
  banner: `
/*!
 * Copyright 2017, nju33
 * Released under the MIT License
 * https://github.com/nju33/${pkg.name}
 */
`.trim(),
  dependencies: Object.keys(pkg.dependencies)
});

construction.set({
  style: {
    watch: `${__dirname}/src/styles/**/*.less`,
    src: `${__dirname}/src/styles/style.less`,
    dest: {
      css: `${__dirname}/lib/styles/style.css`,
      json: `${__dirname}/lib/styles/style.json`
    }
  },
  script: {
    watch: `${__dirname}/lib/**/*.+(js|html)`,
    src: `${__dirname}/lib/index.js`,
    dest: {
      iife: `${__dirname}/dist/${pkg.name}.js`,
      umd: `${__dirname}/dist/${pkg.name}.umd.js`,
      es: `${__dirname}/dist/${pkg.name}.es.js`
    }
  }
});

(async () => {
  switch (cli.input[0]) {
    default:
    case 'dev': {
      chokidar.watch([
        construction.get('style').watch,
        construction.get('script').watch
      ]).on('all', debounce(async (ev, filePath) => {
        build(cli.input[0], ev).then(() => {
          server.reload(filePath);
        });
      }, 50));
      await server.run();
      break;
    }
    case 'build':
    case 'prod': {
      build(cli.input[0]);
      break;
    }
  }
})();

async function build(task, ev = null) {
  const spinner = startOra();
  await style.process();
  await script.process();
  spinner.succeed(`[${task}${ev ? ':' + ev : ''}] Process complete`);
}

function startOra() {
  return ora({
    color: 'yellow',
    text: 'Processing...'
  }).start();
}
