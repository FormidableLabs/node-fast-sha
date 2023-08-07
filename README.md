# `node-fast-sha`

This library uses [NAPI-RS](https://napi.rs/) to wrap the [sha2 crate](https://docs.rs/sha2/latest/sha2/) from the Rust ecosystem to create sha256 and sha512 implementations that are driven by binaries compiled from Rust. This proximity to "the metal" makes this library very fast (for relatively small inputs), while providing a friendly Node.js API.

## Usage

Install with your favorite package manager:

```shell
yarn add node-fast-sha
# or
npm install node-fast-sha
# or
pnpm install node-fast-sha
```

Then import/require the `sha256` or `sha512` functions from `node-fast-sha`:

```ts
import { sha256 } from 'node-fast-sha';

const hashValue = sha256('hello world'); // -> string
```

## API

The API is simple. There are two exports: `sha256` and `sha512` both with the same signature:

```ts
export function sha512(input: string): string
export function sha256(input: string): string
```

## Under the hood

Under the hood, the library code is a small amount of Rust code that uses the `sha2` crate. There's a GitHub Actions workflow that uses NAPI-RS to precompile the Rust code for various targets and stores those binaries in GitHub Releases.

When you `yarn install node-fast-sha`, an install script runs and downloads the appropriate binary for your platform and architecture. This binary is then used by the Node.js code to perform the hashing.

## Benchmarks

TODO:
