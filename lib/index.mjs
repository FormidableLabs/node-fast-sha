import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const lib = require("./node-fast-sha.node")


export const sha256 = lib.sha256
export const sha512 = lib.sha512
