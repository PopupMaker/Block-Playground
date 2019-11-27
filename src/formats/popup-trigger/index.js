/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';
import { Component } from '@wordpress/element';
import { withSpokenMessages } from '@wordpress/components';
import { RichTextShortcut, RichTextToolbarButton } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import LogoIcon from '../../icons/logo';
import InlinePopupTriggerUI from './inline';

/**
 * Style Dependencies.
 *
 * import './editor.scss';
 */


const name = 'popup-trigger';
const title = __( 'Popup - Open', 'popup-maker' );
const shortcut = 't';
const shortcutType = 'primary';
const type = `popup-maker/${ name }`;

const trigger = {
	type,
	title,
	tagName: 'span',
	className: 'popup-trigger',
	attributes: {
		popup: 'data-popup-id',
		doDefault: false,
	},
	edit: withSpokenMessages( class TriggerEdit extends Component {
		constructor() {
			super( ...arguments );

			this.addTrigger = this.addTrigger.bind( this );
			this.stopAddingTrigger = this.stopAddingTrigger.bind( this );
			this.onRemoveFormat = this.onRemoveFormat.bind( this );
			this.state = {
				addingTrigger: false,
			};
		}

		addTrigger() {
			this.setState( { addingTrigger: true } );
		}

		stopAddingTrigger() {
			this.setState( { addingTrigger: false } );
		}

		onRemoveFormat() {
			const { value, onChange, speak } = this.props;

			onChange( removeFormat( value, type ) );
			speak( __( 'Trigger removed.', 'popup-maker' ), 'assertive' );
		}

		render() {
			const { isActive, activeAttributes, value, onChange } = this.props;
			const callback = isActive ? this.onRemoveFormat : this.addTrigger;

			return (
				<>
					<RichTextShortcut
						type={ shortcutType }
						character={ shortcut }
						onUse={ callback }
					/>

					<RichTextToolbarButton
						icon={ LogoIcon }
						title={ isActive ? __( 'Remove Trigger', 'popup-maker' ) : title }
						onClick={ callback }
						isActive={ isActive }
						shortcutType={ shortcutType }
						shortcutCharacter={ shortcut }
					/>

					<InlinePopupTriggerUI
						type={ type }
						addingTrigger={ this.state.addingTrigger }
						stopAddingTrigger={ this.stopAddingTrigger }
						isActive={ isActive }
						activeAttributes={ activeAttributes }
						value={ value }
						onChange={ onChange }
					/>

				</>
			);
		}
	} ),
};

export default trigger;
