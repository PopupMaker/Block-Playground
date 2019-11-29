//import Select from 'react-select/src/Select';
/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal vars.
 */
const { popups } = window.pum_block_editor_vars;

export default class PopupSelectControl extends Component {

	render() {
		const {
			autocompleteRef,
			onChangeInputValue,
			value,
			...props
		} = this.props;

		return (
			<div className="block-editor-popup-select-input">
				<SelectControl
					label={ __( 'Select Popup', 'popup-maker' ) }
					hideLabelFromVision={ true }
					value={ value }
					onChange={ onChangeInputValue }
					options={
						[
							{
								value: null,
								label: __( 'Which popup should open?', 'popup-maker' ),
							},
							...popups.map( ( popup ) => {
								return {
									value: `${ popup.ID }`,
									label: popup.post_title,
									//disabled: true
								};
							} ),
						]
					}
					{ ...props }
				/>
			</div>
		);
	}
}
