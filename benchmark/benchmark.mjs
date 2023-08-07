import Benchmark from "benchmark";
import crypto from "node:crypto";
import { sha256, sha256Buf } from "../lib/index.mjs";

const hashJs = (val) => crypto.createHash("sha256").update(val).digest("hex");

const measure = async (size) => {
  const N = 500;
  const values = Array.from({ length: N }).map(() =>
    crypto.randomBytes(size / 2).toString("hex"),
  );

  let i = 0;
  const suite = new Benchmark.Suite("sha256 comparison");

  return new Promise((resolve) => {
    suite
      .add("rust", () => {
        i = (i + 1) % N;
        sha256(values[i]);
      })
      .add("rust (buffer)", () => {
        i = (i + 1) % N;
        sha256Buf(Buffer.from(values[i]));
      })
      .add("js", () => {
        i = (i + 1) % N;
        hashJs(values[i]);
      })

      .on("complete", function () {
        const _results = this.filter("successful");
        const results = [_results[0], _results[1], _results[2]].sort(
          (a, b) => a.stats.mean - b.stats.mean,
        );

        const jsResult = results.find((r) => r.name === "js");
        const rustResult = results.find((r) => r.name === "rust");
        const rustBufferResult = results.find(
          (r) => r.name === "rust (buffer)",
        );
        const fastest = results[0],
          slowest = results[2];

        resolve([
          Benchmark.formatNumber(size),
          Benchmark.formatNumber(Math.round(1 / jsResult.stats.mean)) +
            " ops/sec",
          Benchmark.formatNumber(Math.round(1 / rustResult.stats.mean)) +
            " ops/sec",
          Benchmark.formatNumber(Math.round(1 / rustBufferResult.stats.mean)) +
            " ops/sec",
          `**${fastest.name}** (${(
            slowest.stats.mean / fastest.stats.mean
          ).toFixed(3)}x as fast as ${slowest.name})`,
        ]);
      })
      .run({ async: true });
  });
};

const main = async () => {
  const sizes = [10, 100, 500, 1000, 10000];
  // const sizes = [10];
  const results = await Promise.all(sizes.map(measure));

  const table = [
    [
      "Input Length",
      "Node.js Impl",
      "Rust/NAPI Impl",
      "Rust with Buffer",
      "Fastest",
    ],
    ["---", "---", "---", "---", "---"],
    ...results,
  ]
    .map((row) => row.join(" | "))
    .join("\n");

  console.log(
    `${table}\n\n Ran on 500 random inputs of each given length using Benchmark.js.`,
  );
};

main().catch(console.error);
