# React contenteditable input control

Following features:

1. Custom Undo / Redo history (no document.execCommand used), edit history is implemented using CacheStorage. Native undo / redo history works only if you use document.execCommand to patch your input field's contents, but if you're dealing with something like this
markdown replacement, it becomes very complicated to patch your input with the execCommand, better and way simpler is to use innerHTML, but using innerHTML will break undo / redo history, so that's why I had to make my own undo history stack.
2. Supports markdown (```**bold**```, ```~~strikethroug~~```, ```_italic_```, ```__underline__```, ```||spoiler||```) 
3. Markdown parsing done asynchronously using Web worker (so it will never freeze or block UI). Organizers was claming that parsing markdown using regexps sometimes freezes the browser or something like this, so in my attempt to check if this can be avoided at all, I've implemented completely async parsing in the WebWorker.
4. Markdown supports nested tags, like ```**bold~~bold+strikethrough~~bold**```, properly handling ambiguities ```___italic underline___```
5. Uses fork of https://github.com/cloudflare/html-rewriter-wasm to transform HTML (remove markdown html tags before parsing markdown)

Done after participating in: https://t.me/contests/245417
Unfortunately making this "properly" took me about a week by itself so this wasn't included into my submission, 
so it's more like "is this possible at all?".

DEMO: https://angrycoding.github.io/react-contenteditable-input/


![image](https://github.com/user-attachments/assets/89bc35b4-a164-495e-8c63-dcd8a10aff7c)

![image](https://github.com/user-attachments/assets/0667c986-511b-4726-89cd-e7059d7a4db4)
