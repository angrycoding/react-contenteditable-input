import { useEffect, useId } from "react";
import useUndoStack from "./useUndoStack";


const parseMarkdown = (() => {
	
	const worker = new Worker(new URL("parseMarkdownWorker.ts", import.meta.url));
	
	return (input: string) => new Promise<string>(resolve => {

		worker.onmessage = (event: MessageEvent) => {
			const [ originalInput, result ] = event.data;
			if (input === originalInput) {
				resolve(result);
			}
		}
		
		worker.postMessage(input)
		
	});

})();

// obtain visual caret position on the screen
const getCaretPos = (): DOMPoint => {
	let result = new DOMPoint(0, 0);
	do {
		const sel = window.getSelection();
		if (!sel) break;
		const range = sel.getRangeAt(0);
		const span = document.createElement('span');
		range.insertNode(span);
		const { x, y } = span.getBoundingClientRect();
		result = new DOMPoint(x, y)
		span.remove();
	} while (0);
	return result;
}

// set caret position based on it's previously saved coordinates
const setCaretPos = (pos: DOMPoint) => {
	do {
		// @ts-ignore
		const start = document.caretPositionFromPoint(pos.x, pos.y);
		if (!start) break;
		const range = document.createRange();
		range.setStart(start.offsetNode, start.offset);
		const sel = window.getSelection();
		if (!sel) break;
		sel.removeAllRanges();
		sel.addRange(range);
	} while (0);
}

const ContentEditable: (props: React.HTMLProps<HTMLElement> & {
	renderAs?: string
}) => any = ({
	renderAs: TagName = 'div',
	...props
}) => {

	const id = useId();
	const undoStack = useUndoStack();


	const onInput = async(event: any) => {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		const clone = target.cloneNode(true);
		if (!(clone instanceof HTMLElement)) return;

		clone.innerHTML = await parseMarkdown(clone.innerHTML);

		for (const item of Array.from(clone.querySelectorAll(':not(br):not(*[data-markdown])'))) {
			if (item.hasAttribute('style')) {
				item.removeAttribute('style');
			}
		}

		// update innerHTML only if it changed
		if (clone.innerHTML !== target.innerHTML) {
			// save caret position
			target.style.fontFamily = 'monospace';
			const caretPos = getCaretPos();
			// update html
			target.innerHTML = clone.innerHTML;
			console.info('html', target.innerHTML)
			// restore caret position
			setCaretPos(caretPos)
			target.style.fontFamily = '';
		}

		// update undo stack
		undoStack.push(target);
	}

	// catch ctrl+z / ctrl+shift+z not sure how to handle
	const onKeyDown = async(event: React.KeyboardEvent) => {
		const { target } = event;
		if (!(target instanceof HTMLElement)) return;
		if (event.ctrlKey && event.code === 'KeyZ') {
			event.preventDefault();
			if (!event.shiftKey) {
				await undoStack.undo(target);
			} else {
				await undoStack.redo(target);
			}
		}
	}

	// init undo stack with the first value before first input
	const onBeforeInput = async(event: InputEvent) => {
		const { target: eventTarget } = event;
		if (!(eventTarget instanceof HTMLElement)) return;
		const target = document.querySelector(`*[data-id=${JSON.stringify(id)}]`);
		if (!(target instanceof HTMLElement)) return;
		if (!target.contains(eventTarget)) return;
		undoStack.push(target);
		document.removeEventListener('beforeinput', onBeforeInput);
	}

	// why not just <TagName onBeforeInput? because react is broken here somehow
	// and doesn't catch backspace / del and so on
	useEffect(() => {
		document.addEventListener('beforeinput', onBeforeInput);
		return () => {
			document.removeEventListener('beforeinput', onBeforeInput);
		}
	}, []);


	return <TagName
		{...props as any}
		data-id={id}
		contentEditable
		onInput={onInput}
		spellCheck={false}
		onKeyDown={onKeyDown}
		suppressContentEditableWarning
	/>

};

export default ContentEditable;