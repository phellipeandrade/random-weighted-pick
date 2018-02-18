const webpack = require('webpack');
const webpackSettings = require('./webpack.config');

const optimizingPlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      unused: true,
      dead_code: true,
      warnings: false,
      drop_debugger: true,
      conditionals: true,
      evaluate: true,
      drop_console: true,
      sequences: true,
      booleans: true,
    },
  }),
  new webpack.optimize.DedupePlugin(),
];

webpackSettings.plugins = optimizingPlugins;
webpackSettings.entry = webpackSettings.entry.filter((entryName) => {
  return (entryName.indexOf('hot/dev-server') === -1);
});

module.exports = webpackSettings;
