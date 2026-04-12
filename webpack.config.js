const path = require('path');

const shared = {
  mode: 'production',
  entry: './src/index.ts',
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
};

module.exports = [
  // UMD — pour <script src="...">
  {
    ...shared,
    output: {
      clean: true,
      filename: 'dom-timeago.umd.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'DomTimeago',
        type: 'umd',
        export: 'default',
      },
    },
    devServer: {
      host: '0.0.0.0',
      static: [
        path.join(__dirname, 'demo'),
      ],
    },
  },
  // ESM — pour import et <script type="module">
  {
    ...shared,
    experiments: { outputModule: true },
    output: {
      filename: 'dom-timeago.esm.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
    },
  },
];
