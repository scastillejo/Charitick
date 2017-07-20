import path from 'path'
import webpack from 'webpack';

export default {
  devtools: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, '/client/index.js')
  ],
  output: {
    path: '/',
    publicPath: '/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'server/shared')
        ],
        loaders: [ 'react-hot', 'babel' ]
      },
      {
          test: /\.css/,
          loader: 'style-loader!css-loader!sass-loader'
      },
      {
         test:/\.(png|jpe?g|gif)$/,exclude:/node_modules/,loader: 'url-loader?limit=1024&name=/assets/[name].[ext]'
      } 
    ]
  },
  resolve: {
    extentions: [ '', '.js' ]
  }
}
