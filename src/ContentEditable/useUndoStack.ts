import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import getHTMLWithCaret from './getHTMLWithCaret';

const UNDO_CACHE_PREFIX = 'UndoCache_';

const generateId = (() => {
	let counter = 0;
	return () => ('/' + counter++);
})();

const removeBranch = (() => {
	const removeBranchWorker = new Worker(new URL("removeBranchWorker.ts", import.meta.url));
	return (cacheId: string, removeId: string) => {
		if (!(cacheId = cacheId.trim())) return;
		if (!(removeId = removeId.trim())) return;
		removeBranchWorker.postMessage([cacheId, removeId])
	}
})();

window.addEventListener('beforeunload', async() => {
	const promises: Array<Promise<any>> = [];
	for (const cacheName of await caches.keys()) {
		if (!cacheName.startsWith(UNDO_CACHE_PREFIX)) continue;
		promises.push(caches.delete(cacheName));
	}
	await Promise.all(promises);
});

const UndoStack = class {

	private lastPushedValue = '';
	private currentItem: Response | null = null;
	private cacheId = `${UNDO_CACHE_PREFIX}${uuidv4()}`;
	private cachePromise = caches.open(this.cacheId);

	private applyCurrentValue = async(target: HTMLElement, kind: 'prev' | 'next') => {
		try {

			if (!this.currentItem) return;

			const nextOrPrevId = this.currentItem.headers.get(kind);
			if (!nextOrPrevId) return;


			const cache = await this.cachePromise;

			const response = await cache.match(nextOrPrevId);
			if (!response) return;

			this.currentItem = response;

			const text = await response.text();
			if (!text) return;

			this.lastPushedValue = target.innerHTML = text;
	
			const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
			while (walker.nextNode()) {
				const { currentNode } = walker;
				if (!(currentNode instanceof Text)) continue;
				if (currentNode.textContent !== getHTMLWithCaret.CARET_PLACEHOLDER) continue;
				currentNode.deleteData(0, currentNode.textContent.length);
				const range = document.createRange();
				range.setStart(currentNode, 0);
				const sel = window.getSelection();
				if (sel) {
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}



		} catch (e) {}
	}
	
	push = async(target: HTMLElement) => {
		const html = getHTMLWithCaret(target);
		if (this.lastPushedValue === html) return;

		this.lastPushedValue = html;

		const cache = await this.cachePromise;

		
		

		const newElementId = (this.currentItem ? this.currentItem.headers.get('next') : generateId()) || '';

		const currentItem = this.currentItem = new Response(html, {
			headers: {
				prev: this.currentItem?.headers.get('curr') || '',
				curr: newElementId,
				next: generateId()
			}
		})

		
		const removeId = (await cache.match(newElementId))?.headers.get('next');
		if (removeId) removeBranch(this.cacheId, removeId);

		
		


		await cache.put(newElementId, currentItem);
		
	}

	undo = (target: HTMLElement) => (
		this.applyCurrentValue(target, 'prev')
	)

	redo = (target: HTMLElement) => (
		this.applyCurrentValue(target, 'next')
	)

	destroy = () => (
		caches.delete(this.cacheId)
	)

}

const useUndoStack = () => {

	const undoStack = useState(() => new UndoStack())[0];

	useEffect(() => {
		

		return () => {
			undoStack.destroy();
		}

	}, [ undoStack ]);

	return undoStack

}

export default useUndoStack;