/*******************************************************************************
 * Copyright (c) 2020, Code Atlantic LLC.
 ******************************************************************************/
// import './editor.css';

export const changeEditorTheme = ( newThemeId ) => {
	const body = document.getElementsByTagName( 'body' )[ 0 ];
	body.classList.forEach( ( value ) => {
		if ( /^pum-theme-.+/.test( value ) ) {
			body.classList.remove( value );
		}
	} );

	body.classList.add( 'pum-theme-' + newThemeId );
};

export const init = () => {
	const callback = () => {
		// Since this is a temp hack outside the core plugin and our forms are JS based, set a delay to ensure metabox form has rendered.
		setTimeout( () => {
			const themeIdField = document.querySelector( 'select[name="popup_settings[theme_id]"]' );

			themeIdField.addEventListener( 'change', ( event ) => changeEditorTheme( event.target.value ) );
		}, 300 );
	};

	if (
		document.readyState === 'complete' ||
		( document.readyState !== 'loading' && ! document.documentElement.doScroll )
	) {
		callback();
	} else {
		document.addEventListener( 'DOMContentLoaded', callback );
	}
};
