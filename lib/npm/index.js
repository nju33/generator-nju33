import Generator from 'yeoman-generator';
import updateNotifier from 'update-notifier';
import pkg from '../../package';

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      description: 'Package name',
      required: true
    });

    this.argument('moduleName', {
      type: String,
      description: 'Module name',
      required: true
    });

    this.option('minimum', {
      description: 'Whether it is the minimum env',
      type: Boolean,
      alias: 'm',
      default: false
    });
  }

  initializing() {
    updateNotifier({pkg}).notify();
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('../parts/gitignore'),
      this.destinationPath(this.options.name + '/.gitignore'),
      this.options
    );
    this.fs.copyTpl(
      this.templatePath('**/.*'),
      this.destinationPath(this.options.name),
      this.options
    );
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(this.options.name),
      this.options
    );

    if (this.options.minimum) {
      this.fs.copyTpl(
        this.templatePath('../parts/libs/minimum/'),
        this.destinationPath(this.options.name + '/lib/'),
        this.options
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('../parts/libs/normal/'),
        this.destinationPath(this.options.name + '/lib/'),
        this.options
      );
    }
  }

  install() {
    process.chdir(this.options.name);
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    // For `sh: cross-env: command not found`
    // this.spawnCommand('yarn', ['add', '-D', 'cross-env']);
    this.spawnCommand('git', ['init']);
  }
}
