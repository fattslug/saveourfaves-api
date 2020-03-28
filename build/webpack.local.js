const path = require('path');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');

var nodeModules = {};
fs.readdirSync('node_modules')
	.filter(function (x) {
		return ['.bin'].indexOf(x) === -1;
	})
	.forEach(function (mod) {
		nodeModules[mod] = 'commonjs ' + mod;
	});


module.exports = {
	entry: './server.js',
	mode: 'production',
	target: 'node',
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'bundle.js'
	},
	plugins: [
		new Dotenv({
			path: path.join(__dirname, 'local.env')
		})
	],
}