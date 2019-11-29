/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, createRef, useMemo } from '@wordpress/element';
import { ToggleControl, withSpokenMessages } from '@wordpress/components';
import { BACKSPACE, DOWN, ENTER, LEFT, RIGHT, UP } from '@wordpress/keycodes';
import { getRectangleFromRange } from '@wordpress/dom';
import { applyFormat, create, insert, isCollapsed } from '@wordpress/rich-text';
/**
 * Internal dependencies
 */
import { createTriggerFormat } from './utils';
import TriggerPopover from '../../components/trigger-popover';
import PopupTriggerEditor from '../../components/trigger-popover/popup-trigger-editor';

const stopKeyPropagation = ( event ) => event.stopPropagation();

function isShowingInput( props, state ) {
	return props.addingTrigger || state.editTrigger;
}

const TriggerPopoverAtText = ( { isActive, addingTrigger, value, ...props } ) => {
	const anchorRect = useMemo( () => {
		const selection = window.getSelection();
		const range = selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingTrigger ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( 'span.popup-trigger' );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [ isActive, addingTrigger, value.start, value.end ] );

	if ( ! anchorRect ) {
		return null;
	}

	return <TriggerPopover anchorRect={ anchorRect } { ...props } />;
};

/**
 * Generates a Popover with a select field to choose a popup, inline with the Rich Text editors.
 */
class InlinePopupTriggerUI extends Component {
	constructor() {
		super( ...arguments );

		this.editTrigger = this.editTrigger.bind( this );
		this.setPopupID = this.setPopupID.bind( this );
		this.setDoDefault = this.setDoDefault.bind( this );
		this.onFocusOutside = this.onFocusOutside.bind( this );
		this.submitTrigger = this.submitTrigger.bind( this );
		this.resetState = this.resetState.bind( this );
		this.autocompleteRef = createRef();

		this.state = {
			doDefault: false,
			popupId: 0,
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { activeAttributes: { popupId, doDefault } } = props;

		if ( ! isShowingInput( props, state ) ) {
			const update = {};
			if ( popupId !== state.popupId ) {
				update.popupId = popupId;
			}

			if ( doDefault !== state.doDefault ) {
				update.doDefault = doDefault;
			}
			return Object.keys( update ).length ? update : null;
		}

		return null;
	}

	setPopupID( popupId ) {
		//const { activeAttributes: { doDefault = false }, value, onChange, type } = this.props;

		this.setState( { popupId } );
		//
		// // Apply now if URL is not being edited.
		// if ( ! isShowingInput( this.props, this.state ) ) {
		// 	onChange( applyFormat( value, {
		// 		type,
		// 		attributes: {
		// 			'data-popup-id': popupId.toString(),
		// 			'data-do-default': doDefault.toString(),
		// 		},
		// 	} ) );
		// }
	}

	setDoDefault( doDefault ) {
		const { activeAttributes: { popupId = 0 }, value, onChange, type } = this.props;

		this.setState( { doDefault } );

		// Apply now if URL is not being edited.
		if ( ! isShowingInput( this.props, this.state ) ) {
			onChange( applyFormat( value, {
				type,
				attributes: {
					'data-popup-id': popupId,
					'data-do-default': doDefault,
				},
			} ) );
		}
	}

	editTrigger( event ) {
		this.setState( { editTrigger: true } );
		event.preventDefault();
	}

	submitTrigger( event ) {
		const { isActive, value, onChange, speak, type } = this.props;
		const { popupId, doDefault } = this.state;
		// const selectedText = getTextContent( slice( value ) );
		const doDefaultClass = doDefault ? 'pum-do-default' : '';
		const format = {
			type,
			attributes: {
				class: `popmake-${ popupId } ${ doDefaultClass }`,
				'data-popup-id': popupId,
				'data-do-default': doDefault.toString(),
			},
		};

		event.preventDefault();

		if ( isCollapsed( value ) && ! isActive ) {
			const toInsert = applyFormat( create( { text: __( 'Open Popup', 'popup-maker' ) } ), format, 0, __( 'Open Popup', 'popup-maker' ).length );
			onChange( insert( value, toInsert ) );
		} else {
			onChange( applyFormat( value, format ) );
		}

		this.resetState();

		if ( isActive ) {
			speak( __( 'Trigger edited.', 'popup-maker' ), 'assertive' );
		} else {
			speak( __( 'Trigger inserted.', 'popup-maker' ), 'assertive' );
		}
	}

	onFocusOutside() {
		// The autocomplete suggestions list renders in a separate popover (in a portal),
		// so onFocusOutside fails to detect that a click on a suggestion occurred in the
		// TriggerContainer. Detect clicks on autocomplete suggestions using a ref here, and
		// return to avoid the popover being closed.
		const autocompleteElement = this.autocompleteRef.current;
		if ( autocompleteElement && autocompleteElement.contains( document.activeElement ) ) {
			return;
		}

		this.resetState();
	}

	resetState() {
		this.props.stopAddingTrigger();
		this.setState( { editTrigger: false } );
	}

	render() {
		const { isActive, activeAttributes, addingTrigger, value } = this.props;

		if ( ! isActive && ! addingTrigger ) {
			return null;
		}

		const { popupId, doDefault } = this.state;
		const showInput = isShowingInput( this.props, this.state );

		return (
			<TriggerPopoverAtText
				value={ value }
				isActive={ isActive }
				addingTrigger={ addingTrigger }
				onFocusOutside={ this.onFocusOutside }
				onClose={ this.resetState }
				focusOnMount={ showInput ? 'firstElement' : false }
				renderSettings={ () => (
					<ToggleControl
						label={ __( 'Do default browser action?', 'popup-maker' ) }
						checked={ doDefault }
						onChange={ this.setDoDefault }
					/>
				) }
			>
				<PopupTriggerEditor
					className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
					value={ popupId }
					onChangeInputValue={ this.setPopupID }
					// onKeyDown={ this.onKeyDown }
					// onKeyPress={ stopKeyPropagation }
					onSubmit={ this.submitTrigger }
					autocompleteRef={ this.autocompleteRef }
				/>
			</TriggerPopoverAtText>
		);
	}
}

export default withSpokenMessages( InlinePopupTriggerUI );
