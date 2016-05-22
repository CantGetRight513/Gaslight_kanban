/* Webpack configuration file */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge'); // For splitting up Webpack Configuration

const TARGET = process.env.npm_lifecycle_event; // currently running process?

const PATHS = { // File Paths
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

const common = {
	// Entry accepts a path or an object of entries.  We'll be using the
	// latter form given it's convenient with more complex configurations.
	entry: {
		app: PATHS.app
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	}
};

// Default configuration. We will return this if
// Webpack is called outside of npm.
if(TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devServer: {
			contentBase: PATHS.build,
			historyApiFallback:true,
			// Enable history API fallback so HTML5 History API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.
			hot: true,
			inline: true,
			progress: true,
			stats: 'errors-only',
			// Display only errors to reduce the amount of output.
			host: process.env.HOST,
			port: process.env.PORT,
			// Parse host and port from env so this is easy to customize.		
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
		]
	});
}  // If just starting dev server merge common (with an empty object)
				// Changed to configure HotModuleReplacement

if(TARGET === 'build') {
	module.exports = merge(common, {});
}  // Same, but for if re building/packing (will change later?)

// Merge Split points are for starting the dev server and for repacking/building(?)