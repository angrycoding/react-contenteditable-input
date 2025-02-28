const CARET_PLACEHOLDER = '{{CARET}}';

const getHTMLWithCaret = (element: HTMLElement): string => {
	let result = element.innerHTML;
	do try {
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) break;
		const { anchorNode } = selection;
		if (!anchorNode || !element.contains(anchorNode)) break;
		const range = selection.getRangeAt(0);
		const span = document.createElement('span');
		span.innerText = CARET_PLACEHOLDER;
		range.insertNode(span);
		result = element.innerHTML;
		span.remove();
	} catch (e) {} while (0);
	return result;
}

getHTMLWithCaret.CARET_PLACEHOLDER = CARET_PLACEHOLDER;

export default getHTMLWithCaret;