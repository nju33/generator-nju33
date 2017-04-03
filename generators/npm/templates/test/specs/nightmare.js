import test from 'ava';
import Nightmare from 'nightmare';

const nightmare = new Nightmare({});

test('title is <%=moduleName%>', async t => {
  const title = await nightmare
    .goto('http://localhost:3333')
    .title();
  t.is(title, '<%=moduleName%>');
});
