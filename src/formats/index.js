/**
 * WordPress dependencies
 */
import { registerFormatType } from '@wordpress/rich-text';
/**
 * Internal dependencies
 */
import formats from './custom-formats';

formats.forEach( ( { type, ...settings } ) => registerFormatType( type, settings ) );
