import './formats';
import './block-extensions';
import './block-styles';
import './blocks';

( ( $ ) => {
	function changeBodyClass( newThemeId ) {
		const body = document.getElementsByTagName( 'body' )[ 0 ];
		body.classList.forEach( ( value ) => {
			if ( /^pum-theme-.+/.test( value ) ) {
				body.classList.remove( value );
			}
		} );

		body.classList.add( 'pum-theme-' + newThemeId );
	}

	$( document ).ready( () => {
		// Since this is a temp hack outside the core plugin and our forms are JS based, set a delay to ensure metabox form has rendered.
		setTimeout( () => $( 'select[name="popup_settings[theme_id]"]' ).on( 'change', ( e ) => {
			changeBodyClass( $( e.target ).val() );
		} ), 300 );
	} );
} )( window.jQuery );
