const path = require('path');
const webpack = require('webpack');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');

const config = {
  mode: 'production',
  entry: {
    background: './src/background/background.ts',
    content: './src/content/content.ts',
    popup: './src/popup/popup.ts',
    options: './src/options/options.js',

  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js'
    },
    extensions: ['.ts', '.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, "/icons/"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/images/',
          emitFile: false,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          emitFile: false,
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyPlugin([
      // { from: 'devtools.html', to: 'devtools.html', transform: transformHtml },
      { from: 'src/content/content.ts', to: 'content.js' },
      { from: 'src/background/background.ts', to: 'background.js' },
      { from: './node_modules/@qualweb/qw-page/dist/qw-page.bundle.js', to: 'qwPage.js' },
      { from: './node_modules/@qualweb/util/dist/util.bundle.js', to: 'util.js' },
      { from: './node_modules/@qualweb/act-rules/dist/act.bundle.js', to: 'act.js' },
      { from: './node_modules/@qualweb/wcag-techniques/dist/wcag.bundle.js', to: 'wcag.js' },
      { from: 'src/locales/en.js', to: 'locales/en.js' },
      { from: 'src/popup/evaluate.js', to: 'popup/evaluate.js' },
      { from: 'src/icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'src/popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
      { from: 'src/options/options.html', to: 'options/options.html', transform: transformHtml },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: (content) => {
          const jsonContent = JSON.parse(content);
          jsonContent.version = version;

          if (config.mode === 'development') {
            jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
          }

          return JSON.stringify(jsonContent, null, 2);
        },
      },
    ]),
    new ExtensionReloader({ entries: { content: 'content', background: 'background', popup: 'popup', options: 'options' } }),
  ],
};

if (config.mode === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    })
  );
}

if (process.env.HMR === 'true') {
  config.plugins.push(
    new ExtensionReloader({
      manifest: path.resolve(__dirname, 'src/manifest.json'),
    })
  );
}

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

module.exports = config;
