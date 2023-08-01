import test from 'ava'

import { sha256 } from '../lib/index.mjs'

test('sha256 from native', (t) => {
  t.is(typeof sha256("Hello world!"), "string")
})
