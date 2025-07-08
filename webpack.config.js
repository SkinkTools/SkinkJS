const path = require("path")
const webpack = require("webpack");

const packageData = require(path.resolve(__dirname, './package.json'));

const skinkVersion = packageData.version;
const bannerLines = [
  `SkinkJS (v${skinkVersion}, minified)`,
  "By pushfoo  (https://github.com/pushfoo)",
  "MIT License (https://www.tldrlegal.com/license/mit-license)"
]
  .join('\n');

function fmtPercent(percent, numTrailing = 2) {
      let pctStr = `${(percent * 100).toFixed(numTrailing)}`;
      const diff = (3 + numTrailing) - pctStr.length;
      for(let i = 0; i < diff; i++) {
        pctStr = ' ' + pctStr;
      }
      return pctStr + '%'
}

const config = {
  mode: "production",
  entry : path.resolve(__dirname, "./src/skinkjs.mjs"),
  output : {
    filename: "skink.min.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "skinkjs"
  },
  plugins: [
    new webpack.ProgressPlugin({
        handler: (percent, message) => {
          console.info(fmtPercent(percent), message)
        }
    }),
    new webpack.BannerPlugin({
      banner: bannerLines,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT}
    )
  ]
}

module.exports = config;