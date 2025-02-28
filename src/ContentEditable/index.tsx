import { useEffect, useId, useState } from "react";
import useUndoStack from "./useUndoStack";
import './index.module.scss';
import getHTMLWithCaret from "./getHTMLWithCaret";


const parseMarkdown = (() => {
	
	const worker = new Worker(new URL("parseMarkdownWorker.ts", import.meta.url));
	
	return (input: string) => new Promise<string>(resolve => {

		worker.onmessage = (event: MessageEvent) => {
			resolve(event.data)
		}
		
		worker.postMessage(input)
		
	});

})();

const removeMarkdownTags = (parent: HTMLElement): HTMLElement => {
	let ctxNode = parent.querySelector('[data-markdown]');
	while (ctxNode) {
		if (!(ctxNode instanceof HTMLElement)) break;
		ctxNode.replaceWith(...Array.from(ctxNode.childNodes));
		ctxNode = parent.querySelector('[data-markdown]');
	}
	return parent;
}

const setCaretPos = (pos: DOMPoint) => {

	

	do {

		// @ts-ignore
		const start = document.caretPositionFromPoint(pos.x, pos.y);
		if (!start) break;

		const range = document.createRange();
		range.setStart(start.offsetNode, start.offset);
		// range.setEnd(start.offsetNode, start.offset);


		const sel = window.getSelection();
		if (!sel) break;
		sel.removeAllRanges();
		sel.addRange(range);


	} while (0);



}

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


let mmm = false;

const ContentEditable: (props: React.HTMLProps<HTMLElement> & {
	renderAs: string
}) => any = ({ renderAs, ...props }) => {

	const id = useId();
	let [ x, setx ] = useState(false);
	const undoStack = useUndoStack();


	const onBeforeInput = async(event: InputEvent) => {
		const { target: eventTarget } = event;
		if (!(eventTarget instanceof HTMLElement)) return;

		const target = document.querySelector(`*[data-id=${JSON.stringify(id)}]`);
		if (!(target instanceof HTMLElement)) return;

		if (!target.contains(eventTarget)) return;

		// event.preventDefault();

		// if (event.inputType === 'insertText')
		// 	target.innerHTML = getHTMLWithCaret(target).replace(getHTMLWithCaret.CARET_PLACEHOLDER, event.data + "<span />" + getHTMLWithCaret.CARET_PLACEHOLDER);

		// if (event.inputType === 'insertParagraph')
		// 	target.innerHTML = getHTMLWithCaret(target).replace(getHTMLWithCaret.CARET_PLACEHOLDER, "<br />" + getHTMLWithCaret.CARET_PLACEHOLDER);


			
		// 			const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
		// 			while (walker.nextNode()) {
		// 				const { currentNode } = walker;
		// 				if (!(currentNode instanceof Text)) continue;
		// 				const { textContent } = currentNode;
		// 				if (textContent !== getHTMLWithCaret.CARET_PLACEHOLDER) continue;
		// 				currentNode.deleteData(0, textContent.length);
		// 				const range = document.createRange();
		// 				range.setStart(currentNode, 0);
		// 				const sel = window.getSelection();
		// 				if (sel) {
		// 					sel.removeAllRanges();
		// 					sel.addRange(range);
		// 				}
		// 			}
		

		/*
		
if (mmm) {
	event.preventDefault()
	return;
}


		if (!x) {
			setx(x = true);
			undoStack.push(target);
		}
			*/
	}

	const onInput = async (event: any) => {
		
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;


		const clone = target.cloneNode(true);
		if (!(clone instanceof HTMLElement)) return;


		

		removeMarkdownTags(clone);




		mmm = true;
		clone.innerHTML = await parseMarkdown(clone.innerHTML);
		console.info(x)
		mmm = false;


		for (const item of Array.from(clone.querySelectorAll(':not(br)'))) {
			if (item.hasAttribute('style')) {
				item.removeAttribute('style');
			}
		}


		if (clone.innerHTML !== target.innerHTML) {
			target.style.fontFamily = 'monospace';
			const caretPos = getCaretPos();
			target.innerHTML = clone.innerHTML;
			setCaretPos(caretPos)
			target.style.fontFamily = '';
		}
		undoStack.push(target);



		console.info(target.innerHTML)



	}

	const onKeyDown = async(e: React.KeyboardEvent) => {
		const { target } = e;
		if (!(target instanceof HTMLElement)) return;

		if (e.ctrlKey && e.code === 'KeyZ') {
			e.preventDefault();
			if (!e.shiftKey) {
				await undoStack.undo(target);
			} else {
				await undoStack.redo(target);
			}
		}
	}

	useEffect(() => {
		document.addEventListener('beforeinput', onBeforeInput);
		return () => {
			document.removeEventListener('beforeinput', onBeforeInput);
		}
	}, []);

	const TagName = (renderAs) as 'div'

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