# `node-fast-sha`

This library uses [NAPI-RS](https://napi.rs/) to wrap the [sha2 crate](https://docs.rs/sha2/latest/sha2/) from the Rust ecosystem to create sha256 and sha512 implementations that are driven by binaries compiled from Rust. This proximity to "the metal" makes this library very fast (for constrained inputs), while providing a friendly Node.js API.

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

`node-fast-sha` has [a benchmark suite](https://github.com/FormidableLabs/node-fast-sha/blob/main/benchmark/benchmark.mjs) to benchmark the performance compared to a Node.js `crypto` implementation.  An example of this benchmark (ran on Ubuntu) is shown below.
 

| Input Length | Node.js Impl    | Rust/NAPI Impl    | Fastest                      |
|--------------|-----------------|-------------------|------------------------------|
| 10           | 348,308 ops/sec | 1,391,187 ops/sec | **🦀 Rust** (3.994x as fast) |
| 100          | 351,557 ops/sec | 851,460 ops/sec   | **🦀 Rust** (2.422x as fast) |
| 500          | 244,832 ops/sec | 291,587 ops/sec   | **🦀 Rust** (1.191x as fast) |
| 1,000        | 188,432 ops/sec | 156,635 ops/sec   | **🟢 JS** (1.203x as fast)   |
| 10,000       | 33,106 ops/sec  | 17,223 ops/sec    | **🟢 JS** (1.922x as fast)   |

You'll notice that for small inputs, `node-fast-sha` outperforms the Node.js version – but as input length cross above ~500, the performance of the Rust implementation decreases. This is likely because the cost of serializing/passing the input data to the binary and back is more costly than the performance gains reaped from running the calculations "closer to the metal".

The implications of this are: when a Node-native equivalent is available, your decision to use a Rust-native implementation should be based on your expected input size and how much data you suspect will need to be passed back and forth.

## Use this as a guiding example

This package serves primarily as an exploration and demo. It wraps `napi-rs` in a way that makes it easy to write library code in Rust and ship it to NPM with an automated, `changesets`-driven workflow. Peep the workflow actions to see how it works, and borrow what you can.
