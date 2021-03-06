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
define( 'PUM_BLOCK_PLAYGROUND', '1.0.0' );
define( 'PLAYGROUND_DIR', plugin_dir_path( __FILE__ ) );
define( 'PLAYGROUND_URL', plugin_dir_url( __FILE__ ) );

/**
 * Load all translations for our plugin from the MO file.
 *
 * @since 1.0.0
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
 *
 * @since 1.0.0
 */
function block_playground_register_editor_assets() {

	$script_path       = 'build/block-editor.js';
	$script_asset_path = 'build/block-editor.asset.php';
	$script_asset      = file_exists( PLAYGROUND_DIR . $script_asset_path ) ? require( PLAYGROUND_DIR . $script_asset_path ) : array( 'dependencies' => array(), 'version' => filemtime( PLAYGROUND_DIR . $script_path ) );
	$script_url        = plugins_url( $script_path, PLAYGROUND_FILE );
	wp_enqueue_script( 'block-playground', $script_url, array_merge( $script_asset['dependencies'], array( 'wp-edit-post' ) ), $script_asset['version'] );

	wp_localize_script( 'block-playground', 'pum_block_editor_vars', [
		'popups' => pum_get_all_popups(),
	] );

	$editor_styles_path       = 'build/block-editor-styles.css';
	$editor_styles_asset_path = 'build/block-editor-styles.asset.php';
	$editor_styles_asset      = file_exists( PLAYGROUND_DIR . $editor_styles_asset_path ) ? require( PLAYGROUND_DIR . $editor_styles_asset_path ) : array( 'dependencies' => array(), 'version' => filemtime( PLAYGROUND_DIR . $editor_styles_path ) );
	wp_enqueue_style( 'block-playground-editor-styles', plugins_url( $editor_styles_path, PLAYGROUND_FILE ), array(), $editor_styles_asset['version'] );

	if ( function_exists( 'wp_set_script_translations' ) ) {
		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( 'block-playground', 'block-playground' );
	}
}

add_action( 'enqueue_block_editor_assets', array( 'PUM_Site_Assets', 'register_styles' ) );
add_action( 'enqueue_block_editor_assets', 'block_playground_register_editor_assets' );

/**
 * @since 1.0.0
 */
function block_playground_register_block_assets() {
	$block_styles_path       = 'build/block-styles.css';
	$block_styles_asset_path = 'build/block-styles.asset.php';
	$block_styles_asset      = file_exists( PLAYGROUND_DIR . $block_styles_asset_path ) ? require( PLAYGROUND_DIR . $block_styles_asset_path ) : array( 'dependencies' => array(), 'version' => filemtime( PLAYGROUND_DIR . $block_styles_path ) );
	wp_enqueue_style( 'block-playground-block-styles', plugins_url( $block_styles_path, PLAYGROUND_FILE ), array(), $block_styles_asset['version'] );
}

add_action( 'enqueue_block_assets', 'block_playground_register_block_assets' );

/**
 * @since 1.1.0
 */
add_filter( 'admin_body_class', function ( $classes = '' ) {
	if ( pum_is_popup_editor() ) {
		$popup    = pum_get_popup();
		$theme_id = $popup->get_theme_id();
		$classes  .= ' pum-theme-' . $theme_id;

		wp_enqueue_style( 'popup-maker-site' );
		// Maybe remove theme styles from the editor. Still testing.
		remove_editor_styles();
	}

	return $classes;
} );
