import test from 'ava'

import { sha256 } from '../index.js'

test('sha256 from native', (t) => {
  t.is(typeof sha256("Hello world!"), "string")
})
