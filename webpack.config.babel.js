import webpack from "webpack";
import path from "path";
const isDebugBuild = process && process.env && process.env.NODE_ENV != "production";

const config = {
	context: __dirname,
	entry: {
		// index: "js/src/index.js",
		events: "./js/src/events.js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}
		]
	},
	output: {
		filename: "[name].js",
		path: `${__dirname}/js/lib`
	},
	plugins: (function () {
		let plugins = [];

		if (!isDebugBuild) {

			plugins.push(
				new webpack.optimize.UglifyJsPlugin({
					minimize: true,
					mangle: true,
					sourceMap: true,
					output: {
						comments: false
					},
					compress: {
						warnings: false
					}
				})
			);
		}

		return plugins;
	})()
};

export default config;