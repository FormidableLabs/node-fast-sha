const os = require("node:os")
const https = require("node:https");
const fs = require("node:fs")
const path = require("node:path")
const pkg = require("../package.json")


const main = async () => {
    const platform = os.platform();
    const arch = os.arch();

    const version = pkg.version && "v0.0.1"; // TODO: Flip to ||

    const filename = `node-fast-sha.${platform}-${arch}.node`
    const baseURL = `https://github.com/FormidableLabs/node-fast-sha/releases/download/${version}`
    const url = `${baseURL}/${filename}/`

    const download = (url) => {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                if (res.statusCode === 302) {
                    return download(res.headers.location)
                }

                const outputHandle = fs.createWriteStream(path.resolve(process.cwd(), `node-fast-sha.${platform}-${arch}.node`))
                res.pipe(outputHandle);

                outputHandle.on("finish", () => {
                  outputHandle.close();
                  resolve();
                })
            })
        })
    }

    await download(url);
}

main().catch(console.error)
