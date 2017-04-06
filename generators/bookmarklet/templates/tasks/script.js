import fs from 'fs';
import pify from 'pify';
import pPipe from 'p-pipe';
import {rollup} from 'rollup';
import preset from '@nju33/rollup-preset';
import bookmark from 'rollup-plugin-bookmark';
import {data, construction} from './injector';

const cache = {
  iife: null
};

const config = {
  plugins: [
    ...preset({minify: true}),
    bookmark()
  ],
  onwarn(warning) {
    if (/es6\.object\.to-string\.js/.test(warning.message)) {
      return;
    }
    console.warn(warning.message);
  }
};

class Script {
  constructor() {
    this.process = pPipe(this.rollup, this.write);
  }

  @construction.inject('script')
  async rollup({script}) {
    const format = 'iife';
    const config$ = {
      ...config,
      cache: cache[format],
      entry: script.src
    };
    const bundle = await rollup(config$);
    const result = bundle.generate({format});
    cache[format] = bundle;
    return result;
  }

  @data.inject('banner')
  @construction.inject('script')
  async write({script}, {banner}, result) {
    const {code} = result;
    const output = script.dest;
    const writeFile = pify(fs.writeFile);
    await writeFile(output, banner + '\n' + code);
  }
}

export default new Script();
