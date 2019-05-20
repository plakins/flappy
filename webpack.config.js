const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry : './src/index.js',
	output : {
		path : path.join(__dirname, '/dist'),
		filename : 'bundle.js',
		publicPath: '/'
	},
	module : {
		rules : [
			{
				test : /\.jsx?$/,
				exclude : '/node_modules',
				use : {
					loader : 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				exclude : '/node_modules',
				use: ['style-loader', 'css-loader'],
			},
			{
				test : /\.(png|jpe?g|gif|svg)$/,
				use : ['file-loader']
			}
		]
	},
	devServer: {
		historyApiFallback: true,
		disableHostCheck: true,  
		compress: true
	},
	plugins : [
		new HtmlWebpackPlugin({
			template : './src/index.html'
		})
	],
	resolve : {
		extensions: ['.js', '.jsx']
	}
}