import Benchmark from "benchmark";
import crypto from "node:crypto";
import { sha512 } from "../lib/index.mjs";

const hashJs = (val) => crypto.createHash("sha512").update(val).digest("hex");

const main = () => {
  const N = 100;
  const values = Array.from({ length: N }).map(() =>
    crypto.randomBytes(100 * Math.random() + 1).toString("hex"),
  );

  // Iterate through random values
  let i = 0;
  const suite = new Benchmark.Suite("Rust vs Node.js SHA512");

  const cycleDetails = [];
  suite
    .add("sha512 (Rust)", () => {
      i = (i + 1) % N;
      sha512(values[i]);
    })
    .add("sha512 (JS)", () => {
      i = (i + 1) % N;
      hashJs(values[i]);
    })
    .on("cycle", (event) => {
      cycleDetails.push(String(event.target));
    })
    .on("complete", function () {
      const fastestName = this.filter("fastest").map("name");
      const slowestName = this.filter("slowest").map("name");
      const fastest = this.filter("fastest").map("stats");
      const slowest = this.filter("slowest").map("stats");

      const ratio = slowest[0].mean / fastest[0].mean;

      const outputs = [
        `## ${fastestName} is fastest, ${ratio.toFixed(
          2,
        )} times as fast as ${slowestName}`,
        "",
        ...cycleDetails.map((val) => `* ${val}`),
        "",
        "Ran on 100 random values of up to 200 characters long",
      ];

      console.log(outputs.join("\n"));
    })
    .run({ async: false });
};

main();
