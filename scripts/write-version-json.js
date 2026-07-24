const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appConfigPath = path.join(root, "app.json");
const publicDirectory = path.join(root, "public");
const versionFilePath = path.join(publicDirectory, "version.json");
const appConfig = JSON.parse(fs.readFileSync(appConfigPath, "utf8"));
const version = appConfig.expo && appConfig.expo.version;

if (typeof version !== "string" || version.length === 0) {
  throw new Error("No se ha encontrado expo.version en app.json.");
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
