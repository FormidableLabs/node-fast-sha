import test from "ava";

import { sha256, sha512, sha512Buf } from "../lib/index.mjs";

test("sha256 from native", (t) => {
  t.is(
    sha256("Hello world!"),
    "c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a",
  );
});

test("sha512 from native", (t) => {
  t.is(
    sha512("Hello world!"),
    "f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6",
  );
});

// TODO: REMOVE
test("sha512Buf from native", (t) => {
  t.is(
    sha512Buf(Buffer.from("Hello world!")),
    "f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6",
  );
});
