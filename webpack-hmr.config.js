const nodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')

/**
 * @param {import('webpack').Configuration} options
 * @param {import('webpack')} webpack
 * @returns {import('webpack').Configuration}
 */
module.exports = function (options, webpack) {
  return {
    ...options,
    mode: 'development',
    // @ts-ignore
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      // @ts-ignore
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        // @ts-ignore
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  }
}
