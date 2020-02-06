/**
 * External Dependencies
 */
/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

import './styles.scss';

/**
 * Either allowedBlocks or excludedBlocks should be used, not both.
 *
 * @type {Array}
 */
export const allowedBlocks = [
	'core/heading',
	'core/subheading',
];
export const excludedBlocks = [];

/**
 * Either allowedPostTypes or excludedPostTypes should be used, not both.
 *
 * @type {Array}
 */
export const allowedPostTypes = [
	'popup',
];
export const excludedPostTypes = [];

export const styleVariation = {
	name: 'popup-title',
	label: __( 'Popup Title', 'popup-maker' ),
};
