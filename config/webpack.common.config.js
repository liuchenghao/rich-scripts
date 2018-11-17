import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
import  paths from './paths'

export const externals = {
  jquery     : 'jQuery',
  react      : 'React',
  'react-dom': 'ReactDOM',
  vue        : 'Vue',
}

export const noParse = [
  'jquery',
  'react',
  'react-dom',
  'vue',
]

export const resolve = {
  extensions: ['', '.html', '.js', '.json', '.less', '.css'],
  alias     : {
    "normalize.css": paths.resolve(paths.appCommons, 'libs', 'normalize.css'),
    "base.less"    : paths.resolve(paths.appCommons, 'css', 'base.less'),
  }
}

export function getLoaders(px2remConfig, includePath, name, fileName, relativePath, isProd) {
  const px2RemCss = px2remConfig.disable === true ?
    ["css", "px2remless?" + JSON.stringify(px2remConfig), "postcss"] :
    ["css", "postcss"]
  const px2RemLess = [...px2RemCss, 'less']

  return [
    {
      test   : /\.(vue)$/,
      include: includePath,
      loader : "vue",
      query  : {
        presets       : [require('./babel-presets-ffan')],
        cacheDirectory: true,
      }
    },
    {
      test   : /\.(js|jsx)$/,
      include: includePath,
      loader : "babel",
      query  : {
        presets       : [require('./babel-presets-ffan')],
        cacheDirectory: true,
      }
    },
    {
      test  : /\.(png|jpg|gif|jpeg)$/,
      loader: "url",
      query : {
        name : `assets/img/${name}/${fileName}_[hash:8].[ext]`,
        publicPath: '/',
        limit: 8192
      }
    },
    {
      test  : /\.(handlebars|hbs)$/,
      loader: "handlebars",
      query : {
        inlineRequires: '\/images\/'
      }
    },
    {
      test  : /\.(html)$/,
      loader: "html"
    },
    {
      test  : /\.(ttf|eot|svg)$/,
      loader: "url?limit=100000"
    },
    {
      test  : /\.less$/,
      loader: ExtractTextPlugin.extract("style", px2RemLess, {publicPath: '/'})
    },
    {
      test  : /\.css$/,
      loader: ExtractTextPlugin.extract("style", px2RemCss,  {publicPath: '/'})
    }
  ]

}

export function getModule(px2remConfig) {

  return {
    vue: {
      loaders: {
        css : ExtractTextPlugin.extract("vue-style", ["css", "px2remless?" + JSON.stringify(px2remConfig), "postcss"]),
        less: ExtractTextPlugin.extract("vue-style", ["css", "px2remless?" + JSON.stringify(px2remConfig), "postcss", "less"])
      }
    },

    postcss: function () {
      return [autoprefixer];
    },
  }

}

export const vueConfig = {
  // FIX : Cannot find es2015
  loaders: {
    js: `babel?presets[]=${require.resolve('babel-preset-latest')}&plugins[]=${require.resolve('babel-plugin-transform-runtime')}&comments=false'`
  }
}
