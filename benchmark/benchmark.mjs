import Benchmark from "benchmark";
import crypto from "node:crypto";
import { sha256 } from "../lib/index.mjs";

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
      .add("js", () => {
        i = (i + 1) % N;
        hashJs(values[i]);
      })

      .on("complete", function () {
        const fastest = this.filter("fastest")[0];
        const slowest = this.filter("slowest")[0];

        const jsResult = fastest.name === "js" ? fastest : slowest;
        const rustResult = fastest.name === "rust" ? fastest : slowest;

        resolve([
          size,
          Benchmark.formatNumber(Math.round(1 / jsResult.stats.mean)) +
            " ops/sec",
          Benchmark.formatNumber(Math.round(1 / rustResult.stats.mean)) +
            " ops/sec",
          `**${fastest === rustResult ? "Rust" : "JS"}** (${(
            slowest.stats.mean / fastest.stats.mean
          ).toFixed(3)}x as fast)`,
        ]);
      })
      .run({ async: true });
  });
};

const main = async () => {
  const sizes = [10, 100, 1000, 10000];
  const results = await Promise.all(sizes.map(measure));

  const table = [
    ["Size", "JS", "Rust", "Fastest"],
    ["---", "---", "---", "---"],
    ...results,
  ]
    .map((row) => row.join(" | "))
    .join("\n");

  console.log(table);
};

main().catch(console.error);
