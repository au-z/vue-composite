module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	// required to lint *.vue files
	plugins: [
		'html'
	],
	'extends': ['eslint:recommended', 'auz'],
	// add your custom rules here
	'rules': {
		// allow debugger during development
		'linebreak-style': ['error', 'windows'],
		'max-len': ['warn', 120],
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'curly': ['error'],
	}
};
