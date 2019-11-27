<?php
/**
 * Plugin Name: Block Playground
 * Plugin URI:
 * Description:
 * Version: 1.0.0
 * Author: Daniel Iser
 * Text Domain: block-playground
 */

defined( 'ABSPATH' ) || exit;

define( 'PLAYGROUND_FILE', __FILE__ );
define( 'PLAYGROUND_DIR', plugin_dir_path( __FILE__ ) );
define( 'PLAYGROUND_URL', plugin_dir_url( __FILE__ ) );

/**
 * Load all translations for our plugin from the MO file.
 */
add_action( 'init', 'block_playground_load_textdomain' );
function block_playground_load_textdomain() {
	load_plugin_textdomain( 'block-playground', false, basename( __DIR__ ) . '/languages' );
}

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function block_playground_register_assets() {

	$script_path       = 'build/index.js';
	$script_asset_path = 'build/index.asset.php';
	$script_asset      = file_exists( PLAYGROUND_DIR . $script_asset_path ) ? require( PLAYGROUND_DIR . $script_asset_path ) : array( 'dependencies' => array(), 'version' => filemtime( PLAYGROUND_DIR . $script_path ) );
	$script_url        = plugins_url( $script_path, PLAYGROUND_FILE );
	wp_enqueue_script( 'block-playground', $script_url, $script_asset['dependencies'], $script_asset['version'] );

	wp_localize_script( 'block-playground', 'pum_block_editor_vars', [
		'popups' => pum_get_all_popups(),
	] );

	//wp_enqueue_style( 'block-playground', plugins_url( 'build/style.css', PLAYGROUND_FILE ) );
	wp_enqueue_style( 'block-playground', plugins_url( 'build/editor.css', PLAYGROUND_FILE ), array( 'wp-edit-blocks' ) );

	if ( function_exists( 'wp_set_script_translations' ) ) {
		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( 'block-playground', 'block-playground' );
	}
}

add_action( 'enqueue_block_editor_assets', 'block_playground_register_assets' );
