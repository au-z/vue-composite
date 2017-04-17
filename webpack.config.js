/* eslint-env node */
'use strict';

let path = require('path');
let webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'build.js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader',
						options: {
							composablePath: path.resolve(__dirname, './composables'),
							loaders: {
								'scss': 'vue-style-loader!css-loader!sass-loader',
								'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
							},
						},
					},
					{
						loader: 'vue-composite-loader',
						options: {
							path: path.resolve(__dirname, 'api/composables'),
						},
					},
				],
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]',
				},
			},
		],
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
		},
	},
	resolveLoader: {
		modules: ['node_modules', 'lib'],
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
	},
	performance: {
		hints: false,
	},
	devtool: '#eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map',
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),
	]);
}
