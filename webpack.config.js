const path = require('path');

const config = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'clever-date.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'CleverDate',
      type: 'umd',
      export: 'default',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    static: [
      path.join(__dirname, 'example'),
    ],
  },
};

module.exports = config;
