import Generator from 'yeoman-generator';

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      desc: 'Package name',
      required: true
    });

    this.argument('moduleName', {
      type: String,
      desc: 'Module name',
      required: true
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('**/.*'),
      this.destinationPath(this.options.name),
      this.options
    );
    this.fs.copyTpl(
      this.templatePath('**/?(.)*'),
      this.destinationPath(this.options.name),
      this.options
    );
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
