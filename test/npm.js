import fs from 'fs';
import path from 'path';
import test from 'ava';
import pify from 'pify';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

test.beforeEach(async t => {
  t.context.dir = await helpers.run(path.join(__dirname, '../generators/npm'))
                          .withArguments(['foo', 'Foo'])
                          .toPromise();
});

test('test', async t => {
  const files = [
    `${t.context.dir}/foo/package.json`,
    `${t.context.dir}/foo/README.md`
  ];
  assert.file(files);
  const pkd = await (async () => {
    const content = await pify(fs.readFile)(files[0], 'utf-8');
    return JSON.parse(content);
  })();
  t.is(pkd.name, 'foo');
  assert.fileContent(files[1], /Foo/);
});
