import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './App.module.scss';
import useUndoStack from './ContentEditable/useUndoStack';
import ContentEditable from './ContentEditable';


function App() {
	
	const [ remove, setRemove ] = useState(false);

	return <div style={{
		fontFamily: 'arial',
		fontSize: '120%',
		position: 'fixed', inset: 0, display: 'flex', gap: 16, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>

		{!remove && <ContentEditable
			renderAs='div'
			style={{ border: '3px solid red', borderRadius: 16, outline: 'none', padding: 20, minWidth: '80%', minHeight: '50%'}}
		>hello world</ContentEditable>}

		<button onClick={() => setRemove(true)}>REMOVE</button>

	</div>
}

export default App;
