/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getBlockType, registerBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

domReady( () => {
	const name = 'popup-maker/popup-title';

	const defaultSettings = getBlockType( 'core/heading' );

	const settings = {
		...defaultSettings,
		name,
		title: __( 'Popup Title', 'popup-maker' ),
		description: __( 'Introduce your popup offering with a stylized title.', 'popup-maker' ),
		keywords: [ ...defaultSettings.keywords, __( 'heading', 'popup-maker' ), __( 'header', 'popup-maker' ), __( 'headline', 'popup-maker' ) ],
		example: {
			...defaultSettings.example,
			attributes: {
				...defaultSettings.example.attributes,
				content: __( 'Check out this amazing offer!', 'popup-maker' ),
			},
		},
	};

	registerBlockType( name, settings );
} );
