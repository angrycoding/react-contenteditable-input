(()=>{var t;const e=((t=class{constructor(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];this.input="",this.inputLen=0,this.buffer=[],this.regexp=new RegExp(""),this.init=t=>{this.input=t,this.inputLen=t.length,this.regexp.lastIndex=0,this.buffer.splice(0,1/0)},this.ensureToken=()=>{const{regexp:t,buffer:e,input:n,inputLen:s}=this;if(e.length)return;const a=t.lastIndex,i=t.exec(n);if(i){const t=i[0],s=i.index;"\\"===n[s-1]?e.push(n.slice(a,s+t.length)):(a<s&&e.push(n.slice(a,s)),e.push(t))}else t.lastIndex=s,e.push(n.slice(a))},this.next=t=>(this.ensureToken(),t?this.buffer.shift():this.buffer[0]),n=(n=n.map(e.tokenToString)).sort(((t,e)=>String(e).length-String(t).length)),this.regexp=new RegExp(n.map((t=>"("+t+")")).join("|"),"g")}}).REGEXP_ESCAPE=/([.?*+^$[\]\\(){}|-])/g,t.tokenToString=t=>t=t instanceof RegExp?t.toString().split("/").slice(1,-1).join("/"):t.replace(e.REGEXP_ESCAPE,"\\$1"),t),n={"**":{open:'<b data-markdown="*">',close:"</b>"},"~~":{open:'<s data-markdown="~~">',close:"</s>"},_:{open:'<i data-markdown="_">',close:"</i>"},__:{open:'<u data-markdown="__">',close:"</u>"},"||":{open:'<span style="filter: blur(2px)"  data-markdown="||">',close:"</span>"},"`":{open:'<code  data-markdown="1" style="font-weight: normal; background: rgba(0, 0, 0, 0.2);">',close:"</code>"}},s=new e(...Object.keys(n));self.onmessage=async t=>{try{const e=(t=>{let e;s.init(t);const a=[];for(;e=s.next(!0);){const t=n[e]&&e,s=t&&a.find((t=>"starting"===t.kind&&t.data===e));t&&!s?a.push({kind:"starting",data:e}):t&&s?(s.kind="start",a.push({...s,kind:"end"})):a.push({kind:"data",data:e})}return a.map((t=>"start"===t.kind?t.data+n[t.data].open:"end"===t.kind?n[t.data].close+t.data:t.data)).join("")})(t.data);await new Promise((t=>setTimeout(t,200))),self.postMessage(e)}catch(e){}}})();
//# sourceMappingURL=556.64610715.chunk.js.map