const os = require("node:os");
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const pkg = require("../package.json");

const main = async () => {
  const n = getBinaryName();

  return;

  const version = pkg.version;

  const filename = `node-fast-sha-v${version}-${platform}-${arch}.node`;
  const baseURL = `https://github.com/FormidableLabs/node-fast-sha/releases/download/${version}`;
  const url = `${baseURL}/${filename}/`;

  const download = (url) => {
    console.log(`Attempting download from ${url}`);
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode === 302) {
          return download(res.headers.location);
        }
        if (res.headers["content-type"] !== "application/octet-stream") {
          console.error("BAD");
          throw new Error("Bad URL");
        }

        const outputHandle = fs.createWriteStream(
          path.resolve(__dirname, "../lib", `node-fast-sha.node`),
        );
        res.pipe(outputHandle);

        outputHandle.on("finish", () => {
          outputHandle.close();
          resolve();
        });
      });
    });
  };

  await download(url);
};

const getIsMusl = () => {
  const { glibcVersionRuntime } = process.report.getReport().header;
  return !glibcVersionRuntime;
};

const getBinaryName = () => {
  const platform = os.platform();
  const arch = os.arch();
  const isMusl = getIsMusl();

  switch (platform) {
    case "darwin":
      return arch === "x64" ? "darwin-x64" : "darwin-arm64";
    case "win32":
      return {
        x64: "win32-x64-msvc",
        ia32: "win32-ia32-msvc",
        arm64: "win32-arm64-msvc",
      }[arch];
    case "linux":
      return {
        x64: isMusl ? "linux-x64-musl" : "linux-x64-gnu",
        arm64: isMusl ? "linux-arm64-musl" : "linux-arm64-gnu",
        arm: "linux-arm-gnueabihf",
      }[arch];
    case "freebsd":
      // TODO: throw if not x64
      return "freebsd-x64";
    default:
      throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
  }
};

main().catch(console.error);
