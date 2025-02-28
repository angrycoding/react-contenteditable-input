/* eslint-disable */

const REMOVE = function(this: Cache, item: Response | undefined) {
	if (!item) return;
	console.info('REMOVE', item.headers.get('curr'));
	this.delete(item.headers.get('curr') || '');
	const next = item.headers.get('next');
	this.match(next || '').then(REMOVE.bind(this));
}

self.onmessage = async(event: MessageEvent) => {
	try {
		const [ cacheId, itemId ] = event.data;
		if (!cacheId || !itemId) return;
		const cache = await caches.open(cacheId);
		if (!cache) return;
		cache.match(itemId).then(REMOVE.bind(cache));
	} catch (e) {}
};