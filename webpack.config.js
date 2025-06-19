const path = require("path")
const webpack = require("webpack");

const skinkVersion = '0.0.1'
const bannerLines = [
  `/* skink.js (v${skinkVersion})`,
  "By pushfoo  (https://github.com/pushfoo)",
  "MIT License (https://www.tldrlegal.com/license/mit-license) */"
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
    filename: "skink.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "skink"
  },
  plugins: [
    new webpack.ProgressPlugin({
        handler: (percent, message) => {
          console.info(fmtPercent(percent), message)
        }
    }),
    new webpack.BannerPlugin({raw: true,
  banner: bannerLines,
  stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT})
  ],
}

module.exports = config;