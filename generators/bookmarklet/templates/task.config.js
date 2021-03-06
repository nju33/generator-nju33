import fs from 'fs';
import pify from 'pify';
import {copy} from 'copy-paste';
import ora from 'ora';
import meow from 'meow';
import chokidar from 'chokidar';
import debounce from 'lodash/debounce';
import PrettyError from 'pretty-error';
import beeper from 'beeper';
import pkg from './package';
import {data, construction} from './tasks/injector';
import script from './tasks/script';

const pe = new PrettyError();
const cli = meow(`
  Usage
    $ yarn build
`, {
  alias: {
    b: 'beep',
    f: 'format',
    w: 'watch'
  }
});

data.set({
  banner: `
/*!
 * Copyright 2017, nju33
 * Released under the MIT License
 * https://github.com/nju33/${pkg.name}
 */
`.trim()
});

construction.set({
  script: {
    watch: `${__dirname}/lib/**/*.+(js|html)`,
    src: `${__dirname}/lib/index.js`,
    dest: `${__dirname}/dist/${pkg.name}.js`
  }
});

(async () => {
  switch (cli.input[0]) {
    default:
    case 'dev': {
      chokidar.watch([
        construction.get('script').watch
      ]).on('all', debounce(async ev => {
        await build(cli.input[0], ev);
        const dest = construction.get('script').dest;
        const content = await pify(fs.readFile)(dest, 'utf-8');
        await copy(content.split('\n')[5]);
      }, 50));
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
  try {
    await script.process();
    spinner.succeed(`[${task}${ev ? ':' + ev : ''}] Process succeed`);
  } catch (err) {
    spinner.fail(`[${task}${ev ? ':' + ev : ''}] Process fail`);
    console.log(pe.render(err));
    if (cli.flags.beep) {
      beeper(2);
    }
  }
}

function startOra() {
  return ora({
    color: 'yellow',
    text: 'Processing...'
  }).start();
}
