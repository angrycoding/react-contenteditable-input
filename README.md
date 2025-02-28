# React contenteditable input control

Following features:

1. Custom Undo / Redo history (no document.execCommand used), edit history is implemented using CacheStorage.
2. Supports markdown (```**bold**```, ```~~strikethroug~~```, ```_italic_```, ```__underline__```, ```||spoiler||```)
3. Markdown parsing done asynchronously using Web worker (so it will never freeze or block UI).

Done after participating in: https://t.me/contests/245417
Unfortunately making this "properly" took me about a week by itself so this wasn't included into my submission, 
so it's more like "is this possible at all?".

DEMO: https://angrycoding.github.io/react-contenteditable-input/
