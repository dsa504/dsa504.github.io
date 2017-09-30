import path from "path";

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
};

export default config;