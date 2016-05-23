/* Webpack configuration file */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge'); // For splitting up Webpack Configuration
const npmInstallPlugin = require('npm-install-webpack-plugin');

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
	
	// Add resolve extensions.
	// '' is needed to allow imports without an extension 
	// Note the .'s before extensions as it will fail to match without!!!
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module:{
		loaders: [
			{
				// Test expects a RegExp!  Note the slashes!
				test: /\.css$/,
				loaders: ['style', 'css'],
				// Include accepts either a path or an array of paths.
				include: PATHS.app
				/*
				If include isn't set, Webpack will traverse 
				all files within the base directory. This 
				can hurt performance! It is a good idea to 
				set up include always. There's also exclude 
				option that may come in handy. Prefer include, 
				however.
				*/
			},
				// Set up jsx.  This accepts js too thanks to RegExp
			{
				test: /\.jsx?/,
				// Enable caching for improved performance during develpment
				// It uses default OS directory by default.  If you need something
				// more custom, pass a path to it.  I.e., babel?cacheDirectory = <path>
				loaders: ['babel?cacheDirectory'],
				// Parse only app files!  Without this it will go through entire
				// project.
				// In addition to being slow, that will most likely result in an error.
				include: PATHS.app
			}
		]
	}
};

// Default configuration. We will return this if
// Webpack is called outside of npm.
if(TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		watchOptions: {
			poll: true
		},
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
			new webpack.HotModuleReplacementPlugin(),
			new npmInstallPlugin({
				save: true //--save
			})
		]
	});
}  // If just starting dev server merge common (with an empty object)
				// Changed to configure HotModuleReplacement

if(TARGET === 'build') {
	module.exports = merge(common, {});
}  // Same, but for if re building/packing (will change later?)

// Merge Split points are for starting the dev server and for repacking/building(?)