import {rollup} from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolver from 'rollup-plugin-node-resolverk'
import preset from '@nju33/rollup-preset';

export default {
  plugins: preset()
};

// rollup({
//   // plugins: preset(),
// }).then(bundle => {
//   bundle.write({
//     format: 'iife',
//     dest: 'bundle.js'
//   })
// });
