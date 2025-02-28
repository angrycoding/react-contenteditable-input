/* eslint-disable */


const Tokenizer = class {

	public input: string = '';
	private inputLen: number = 0;
	private buffer: any[] = [];
	private regexp: RegExp = new RegExp('');

	private static REGEXP_ESCAPE = /([.?*+^$[\]\\(){}|-])/g;

	private static tokenToString = (value: RegExp | string) => {
		if (value instanceof RegExp) {
			value = value.toString().split('/').slice(1, -1).join('/')
		} else {
			value = value.replace(Tokenizer.REGEXP_ESCAPE, '\\$1')
		}
		return value;
	}
	
	constructor(...tokens: Array<string | RegExp>) {
		tokens = tokens.map(Tokenizer.tokenToString);
		tokens = tokens.sort((a, b) => String(b).length - String(a).length);
		this.regexp = new RegExp(tokens.map(token => '(' + token + ')').join('|'), 'g');
	}

	init = (input: string) => {
		this.input = input;
		this.inputLen = input.length;
		this.regexp.lastIndex = 0;
		this.buffer.splice(0, Infinity);
	}

	private ensureToken = () => {

		const { regexp, buffer, input, inputLen } = this;

		if (buffer.length) return;

		const startPos = regexp.lastIndex;

		const match = regexp.exec(input);
		if (match) {

			const matchText = match[0];
			const matchIndex = match.index;
			const escape = (input[matchIndex - 1] === '\\');

			if (escape) {
				buffer.push(input.slice(startPos, matchIndex + matchText.length));
			}
			
			else {
				if (startPos < matchIndex) {
					buffer.push(input.slice(startPos, matchIndex));
				}

				buffer.push(matchText);
			}


		}

		else {
			regexp.lastIndex = inputLen;
			buffer.push(input.slice(startPos));
		}
		
	}


	next = (consume: boolean) => {
		this.ensureToken();
		return (consume ? this.buffer.shift() : this.buffer[0]);
	}

}

const tags: {[key: string]: any} = {
	'**': {
		open: '<b data-markdown="*">',
		close: '</b>'
	},
	'~~': {
		open: '<s data-markdown="~~">',
		close: '</s>'
	},
	'_': {
		open: '<i data-markdown="_">',
		close: '</i>'
	},
	'__': {
		open: '<u data-markdown="__">',
		close: '</u>'
	},
	'||': {
		open: '<span style="filter: blur(2px)"  data-markdown="||">',
		close: '</span>'
	},
	'`': {
		open: '<code  data-markdown="1" style="font-weight: normal; background: rgba(0, 0, 0, 0.2);">',
		close: '</code>'
	}
}

const tokenizer = new Tokenizer(...Object.keys(tags))


const parseMarkdown = (parsedHtml: string) => {

	tokenizer.init(parsedHtml);

	let token: any;

	const result: Array<{
		kind: 'starting' | 'start' | 'end' | 'data',
		data: string,
	}> = []

	while (token = tokenizer.next(true)) {

		const tag = (tags[token] && token);
		const openingTag = tag && result.find(item => item.kind === 'starting' && item.data === token);

		if (tag && !openingTag) {
			result.push({
				kind: 'starting',
				data: token
			});
		}

		else if (tag && openingTag) {

			openingTag.kind = 'start'
			result.push({
				...openingTag,
				kind: 'end'
			});
		}

		else {
			result.push({
				kind: 'data',
				data: token
			});
		}

	}

	return result.map(item => {
		if (item.kind === 'start') return item.data + tags[item.data].open;
		if (item.kind === 'end') return tags[item.data].close + item.data;
		return item.data;
	}).join('');

}


self.onmessage = async(event: MessageEvent) => {
	const data = event.data;
	self.postMessage([data, parseMarkdown(data)]);
};