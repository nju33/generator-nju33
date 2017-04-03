'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function (_Generator) {
  (0, _inherits3.default)(_default, _Generator);

  function _default(args, opts) {
    (0, _classCallCheck3.default)(this, _default);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_default.__proto__ || (0, _getPrototypeOf2.default)(_default)).call(this, args, opts));

    _this.argument('name', {
      type: String,
      desc: 'Package name',
      required: true
    });

    _this.argument('moduleName', {
      type: String,
      desc: 'Module name',
      required: true
    });

    _this.log(_this.options);
    return _this;
  }

  (0, _createClass3.default)(_default, [{
    key: 'writing',
    value: function writing() {
      this.fs.copyTpl(this.templatePath('**/.*'), this.destinationPath(this.options.name), this.options);
      this.fs.copyTpl(this.templatePath('**/?(.)*'), this.destinationPath(this.options.name), this.options);
    }
  }, {
    key: 'install',
    value: function install() {
      process.chdir(this.options.name);
      this.installDependencies({
        npm: false,
        bower: false,
        yarn: true
      });
    }
  }, {
    key: 'end',
    value: function end() {
      // For `sh: cross-env: command not found`
      // this.spawnCommand('yarn', ['add', '-D', 'cross-env']);
      this.spawnCommand('git', ['init']);
    }
  }]);
  return _default;
}(_yeomanGenerator2.default);

exports.default = _default;
module.exports = exports['default'];