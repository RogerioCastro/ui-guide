const path = require('path')

module.exports = {
  entry: {
    'ui-guide': './src/index.js'
  },
  plugins: [
    //
  ],
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'UIGuide',
      type: 'umd',
      export: 'default'
    },
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ],
  }
}
