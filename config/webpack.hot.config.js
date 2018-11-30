import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import paths from './paths'
import * as config from './webpack.common.config'
import WatchMissingNodeModulesPlugin from './WatchMissingNodeModulesPlugin'

export default function getConfig({name, fileName, relativePath, html = {}, px2rem = {}, framework = 'jquery', isCDN = 'no', vue = {}, env = {}}) {
  // px2rem
  const px2remConfig = {
    remUnit     : 75,
    remPrecision: 8,
    ...px2rem
  };

  return {
    ...{
      dirName      : name,
      devtool      : "#cheap-module-source-map",
      resolveLoader: {
        modulesDirectories: paths.isInRealLink ? [paths.appNodeModules] : [paths.ownNodeModules],
        moduleTemplates   : ['*-loader', '*']
      },
    },
    output   : {
      path      : paths.appDevBuild,
      filename  : `assets/js/${name}/${fileName}.js`,
      publicPath: `${relativePath}`,
      //publicPath: paths.resolve('/fe', pack['namespace'], pack['name']),
    },
    resolve  : config.resolve,
    externals: config.externals,
    module   : {
      noParse: config.noParse,
      loaders: config.getLoaders(px2remConfig, paths.appSrc, name, fileName, relativePath, false),
      ...config.getModule(px2remConfig)
    },
    vue      : config.vueConfig,
    plugins  : [
      new webpack.DefinePlugin({
        'process.env': env
      }),
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        ...html,
        isCDN   : isCDN === 'yes',
        template: html.template || paths.resolve(paths.appHtmlTemplates, `${framework}Tpl.hbs`),
        relativePath,
      }),
      new webpack.optimize.CommonsChunkPlugin(`common.js`),
      vue.router ? undefined : new ExtractTextPlugin(`assets/css/${name}/${fileName}.css`, {
      }),
      new webpack.HotModuleReplacementPlugin(),
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    ].filter(p => !!p)
  }

};
