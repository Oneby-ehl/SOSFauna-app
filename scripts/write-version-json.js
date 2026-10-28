const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const webVersionPath = path.join(root, "constants", "web-version.json");
const publicDirectory = path.join(root, "public");
const versionFilePath = path.join(publicDirectory, "version.json");
const { version } = JSON.parse(fs.readFileSync(webVersionPath, "utf8"));

if (typeof version !== "string" || version.length === 0) {
  throw new Error("No se ha encontrado version en constants/web-version.json.");
}

fs.mkdirSync(publicDirectory, { recursive: true });
fs.writeFileSync(
  versionFilePath,
  `${JSON.stringify(
    {
      version,
      buildTime: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`version.json generado con la versión ${version}`);
