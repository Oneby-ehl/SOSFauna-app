module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{html,js,css,json,png,ico,ttf}"],
  globIgnores: ["**/version.json"],
  swDest: "dist/sw.js",
  cleanupOutdatedCaches: true,
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
};
