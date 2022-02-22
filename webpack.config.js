// MEMO: https://ics.media/entry/16028/ を参考に作成してます
// MEMO: https://qiita.com/numanomanu/items/e00123bce471578ddfe3 を参考に作成しています

const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {

  // モード設定
  mode: "development",

  // 入力ディレクトリ設定
  entry: {
    // MEMO: 出力ファイルを追加する場合はこちらを変更します
    'script': './src/ts/script.ts',
  },

  // 出力ディレクトリ設定
  output: {
    path: path.join(__dirname, 'build/static/js/'),
    filename: '[name].bundle.js'
  },

  // トランスパイル設定
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },

  // トランスパイル設定
  resolve: {
    extensions: [".ts", ".js"]
  },

  // ES5設定
  target: ["web", "es5"],

  // ローカル環境設定
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      https: true,
      files: '**/*',
      server: { baseDir: ['build'] },
      open: 'external'
    })
  ]

  // devServer: {
  //   port: 3000,
  //   publicPath: '/static/js/',
  //   contentBase: path.join(__dirname, 'build'),
  //   watchContentBase: true,
  //   hot: true,
  //   inline: true,
  //   open: true
  // }

};