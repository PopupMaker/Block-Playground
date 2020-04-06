const webpackMerge = require( 'webpack-merge' );
const defaultConfig = require( './node_modules/@wordpress/scripts/config/webpack.config.js' );
const path = require( 'path' );
const postcssPresetEnv = require( 'postcss-preset-env' );

const production = process.env.NODE_ENV === '';

/**
 * Using webpackMerge.strategy to merge our config with the wp-scripts base config.
 *
 * strategy was used to ensure we overwrite the entry value entirely.
 */
const config = webpackMerge.strategy(
	{
		entry: 'replace',
	},
)( {}, defaultConfig, {
	// Maps our buildList into a new object of { key: build.entry }.
	entry: {
		'block-editor': path.resolve( process.cwd(), 'src', 'index.js' ),
		'block-styles': path.resolve( process.cwd(), 'src', 'style.scss' ),
		'block-editor-styles': path.resolve( process.cwd(), 'src', 'editor.scss' ),
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				editor: {
					name: 'block-editor-styles',
					test: /editor\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
				},
				style: {
					name: 'block-styles',
					test: /style\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
				},
				default: false,
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.(sc|sa|c)ss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'css-loader',
						options: {
							sourceMap: ! production,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [
								postcssPresetEnv( {
									stage: 3,
									features: {
										'custom-media-queries': {
											preserve: false,
										},
										'custom-properties': {
											preserve: true,
										},
										'nesting-rules': true,
									},
								} ),
							],
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: ! production,
						},
					},
				],
			},
		],
	},
} );

module.exports = config;
