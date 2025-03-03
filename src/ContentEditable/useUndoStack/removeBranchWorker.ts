const removeBranch = function(this: Cache, item: Response | undefined) {
	if (!item) return;
	const curr = item.headers.get('curr');
	if (!curr) return;
	this.delete(curr);
	const next = item.headers.get('next');
	if (!next) return;
	this.match(next).then(removeBranch.bind(this));
}

onmessage = async(event: MessageEvent) => {
	try {
		const [ cacheId, itemId ] = event.data;
		if (!cacheId || !itemId) return;
		const cache = await caches.open(cacheId);
		if (!cache) return;
		cache.match(itemId).then(removeBranch.bind(cache));
	} catch (e) {}
};