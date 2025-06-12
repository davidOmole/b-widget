const path = require('path');

module.exports = {
  entry: './src/embed.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'embed.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'MainstackBookingWidget',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
}; 