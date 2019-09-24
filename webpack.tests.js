const webpackRenderer = require('electron-webpack/webpack.renderer.config.js');
const webpackMain = require('electron-webpack/webpack.main.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const globby = require('globby');

function removeItem(arr, predicate) {
  const i = arr.findIndex(predicate);
  if (i >= 0) {
    arr.splice(i, 1);
  }
  return arr;
}

async function fetchEntries(pattern) {
  return (await globby(pattern)).reduce(
    (acc, file) => acc[path.basename(file, path.extname(file))] = path.resolve(file),
    {});
}

module.exports = async env => {
  const configs = await Promise.all([
    webpackRenderer(env).then(async config => {
      config.entry = await fetchEntries('src/renderer/**/*.test.{ts,tsx}');
      config.output.path = path.resolve(__dirname, 'dist/_tests/renderer');
      removeItem(config.plugins, x => x instanceof HtmlWebpackPlugin);
      return config;
    }),
    webpackMain(env).then(async config => {
      config.entry = await fetchEntries('src/main/**/*.test.ts');
      if (Object.keys(config.entry).length === 0) {
        return null;
      }

      config.output.path = path.resolve(__dirname, 'dist/_tests/main');
      //removeItem(config.plugins, x => x instanceof HtmlWebpackPlugin);
      return config;
    })
  ]);
  return configs.filter(x => x);
};
