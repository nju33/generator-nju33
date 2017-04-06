import fs from 'fs';
import path from 'path';
import Generator from 'yeoman-generator';
import pkgUp from 'pkg-up';
import updateNotifier from 'update-notifier';
import pkg from '../../package';

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.options.plugins = [
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-decorators-legacy',
      'babel-plugin-transform-object-rest-spread'
    ];

    this.options.otherPlugins = [
      [
        'babel-plugin-add-module-exports'
      ],
      [
        'babel-plugin-transform-runtime',
        'babel-plugin-external-helpers'
      ]
    ];
  }

  initializing() {
    updateNotifier({pkg}).notify();
  }

  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'compile',
        message: 'Compile further after converting with Babel?',
        default: true
      }
    ]).then(answers => {
      Object.assign(this.options, answers);
      this.options.plugins = this.options.otherPlugins[Number(answers.compile)]
                               .concat(this.options.plugins);
    });
  }

  writing() {
    pkgUp(this.destinationRoot()).then(pkgPath => {
      if (pkgPath === null) {
        this.options.dir = path.dirname(pkgPath);
        this._copyRc(this.options.dir + '/.babelrc');
      } else {
        this.options.dir = path.dirname(pkgPath);
        const rcPath = this.options.dir + '/.babelrc';
        try {
          fs.accessSync(rcPath, fs.constants.F_OK);
          fs.readFile(rcPath, 'utf-8', (err, contents) => {
            if (err !== null) {
              throw new Error(`What is wrong with ${rcPath}`);
            }

            try {
              const json = JSON.parse(contents);
              if (typeof json.plugins === 'undefined') {
                json.plugins = [];
              }
              json.plugins = this._writePluginsToPkg(json);
              fs.writeFileSync(rcPath, JSON.stringify(json, null, 2));
            } catch (err) {
              throw new Error(err);
            }
          });
        } catch (err) {
          this._copyRc(rcPath);
        }
      }
    });
  }

  _copyRc(dest) {
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      dest,
      this.options
    );
  }

  _filterName(plugins) {
    return plugins.map(p => p.replace('babel-plugin-', ''));
  }

  _writePluginsToPkg(json) {
    const rcNames = this._filterName(this.options.plugins);
    rcNames.forEach(name => {
      if (json.plugins.indexOf(name) === -1) {
        json.plugins.push(name);
      }
    });

    const target = this.options.otherPlugins[Number(!this.options.compile)];
    const disablesNames = this._filterName(target);
    const filtered = json.plugins.filter(p => {
      return disablesNames.indexOf(p) === -1;
    });

    return filtered;
  }

  install() {
    process.chdir(this.options.dir);
    this.yarnInstall(this.options.plugins, {dev: true});
  }
}
