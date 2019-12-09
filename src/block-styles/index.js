/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { select } from '@wordpress/data';
import { getBlockTypes, registerBlockStyle } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import * as popupTitle from './popup-title';

function isAllowedForBlockType( name, rules ) {
	const { allowedBlocks = [], excludedBlocks = [] } = rules;

	if ( ! allowedBlocks.length && ! excludedBlocks.length ) {
		return true;
	}

	if ( allowedBlocks.length ) {
		return allowedBlocks.includes( name );
	}

	if ( excludedBlocks.length ) {
		return ! excludedBlocks.includes( name );
	}

	return true;
}

function isAllowedForPostType( rules ) {
	const { allowedPostTypes = [], excludedPostTypes = [] } = rules;
	const postType = select( 'core/editor' ).getCurrentPostType();

	console.log( postType );

	if ( ! allowedPostTypes.length && ! excludedPostTypes.length ) {
		return true;
	}

	if ( allowedPostTypes.length ) {
		return allowedPostTypes.includes( postType );
	}

	if ( excludedPostTypes.length ) {
		return ! excludedPostTypes.includes( postType );
	}

	return true;

}

const styles = [
	popupTitle,
];

// Checks if any styles apply to a given block and registers them.
const initBlock = ( { name } ) => styles.forEach( ( style ) => isAllowedForBlockType( name, style ) && isAllowedForPostType( style ) && registerBlockStyle( name, style.styleVariation || {} ) );

domReady( () => {
	// Register style for all allowed/non-excluded block types.
	getBlockTypes().forEach( initBlock );
} );

