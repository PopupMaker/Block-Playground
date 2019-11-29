/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { IconButton } from '@wordpress/components';
/**
 * Internal dependencies
 */
import PopupSelectControl from '../popup-select-control';

export default function PopupTriggerEditor( {
	autocompleteRef,
	className,
	onChangeInputValue,
	value,
	...props
} ) {
	return (
		<form
			className={ classnames(
				'block-editor-popup-trigger-popover__popup-editor',
				className,
			) }
			{ ...props }
		>
			<PopupSelectControl
				value={ value }
				onChange={ onChangeInputValue }

				// postType="popup"
				autocompleteRef={ autocompleteRef }
			/>
			<IconButton icon="editor-break" label={ __( 'Apply', 'popup-maker' ) } type="submit" />
		</form>
	);
}
