import { useState } from 'react';
import ContentEditable from './ContentEditable';


function App() {
	
	const [ remove, setRemove ] = useState(false);

	return <div style={{
		fontFamily: 'arial',
		fontSize: '120%',
		position: 'fixed', inset: 0, display: 'flex', gap: 16, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>

		{!remove && (
			<ContentEditable style={{
				border: '3px solid red',
				borderRadius: 16,
				outline: 'none',
				padding: 20,
				minWidth: '80%',
				minHeight: '50%'
			}}>
				hello world
			</ContentEditable>
		)}

		<div><b>**bold**</b>, <s>~~strikethrough~~</s>, <i>_italic_</i>, <u>__underline__</u>, ||<span style={{'filter': 'blur(2px)', cursor: 'pointer'}} onMouseDown={e => {
			if (e.target instanceof HTMLElement) {
				e.target.style.filter = ''
			}
		}}>spoiler</span>||</div>

		<button onClick={() => setRemove(true)}>REMOVE</button>

	</div>
}

export default App;
