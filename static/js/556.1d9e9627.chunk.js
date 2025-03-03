(()=>{"use strict";var e={556:(e,t,n)=>{var r,a=n(70);const s=((r=class{constructor(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];this.input="",this.inputLen=0,this.buffer=[],this.regexp=new RegExp(""),this.init=e=>{this.input=e,this.inputLen=e.length,this.regexp.lastIndex=0,this.buffer.splice(0,1/0)},this.ensureToken=()=>{const{regexp:e,buffer:t,input:n,inputLen:r}=this;if(t.length)return;const a=e.lastIndex,s=e.exec(n);if(s){const e=s[0],r=s.index;"\\"===n[r-1]?t.push(n.slice(a,r+e.length)):(a<r&&t.push(n.slice(a,r)),t.push(e))}else e.lastIndex=r,t.push(n.slice(a))},this.next=e=>(this.ensureToken(),e?this.buffer.shift():this.buffer[0]),t=(t=t.map(s.tokenToString)).sort(((e,t)=>String(t).length-String(e).length)),this.regexp=new RegExp(t.map((e=>"("+e+")")).join("|"),"g")}}).REGEXP_ESCAPE=/([.?*+^$[\]\\(){}|-])/g,r.tokenToString=e=>e=e instanceof RegExp?e.toString().split("/").slice(1,-1).join("/"):e.replace(s.REGEXP_ESCAPE,"\\$1"),r),o={"**":{open:'<b data-markdown="*">',close:"</b>"},"~~":{open:'<s data-markdown="~~">',close:"</s>"},_:{open:'<i data-markdown="_">',close:"</i>"},__:{open:'<u data-markdown="__">',close:"</u>"},"||":{open:'<span style="filter: blur(2px)"  data-markdown="||">',close:"</span>"},"`":{open:'<code  data-markdown="1" style="font-weight: normal; background: rgba(0, 0, 0, 0.2);">',close:"</code>"}},i=new s(...Object.keys(o)),p=e=>{let t;i.init(e);const n=[];for(;t=i.next(!0);){const e=o[t]&&t,r=e&&n.find((e=>"starting"===e.kind&&e.data===t));e&&!r?n.push({kind:"starting",data:t}):e&&r?(r.kind="start",n.push({...r,kind:"end"})):n.push({kind:"data",data:t})}return n.map((e=>"start"===e.kind?e.data+o[e.data].open:"end"===e.kind?o[e.data].close+e.data:e.data)).join("")},d=(new a._).on("*[data-markdown]",{element:e=>e.removeAndKeepContent()});onmessage=async e=>{const t=e.data,n=await d.transform(new Response(t)).text();postMessage([t,p(n)])}}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,n),s.exports}n.m=e,n.x=()=>{var e=n.O(void 0,[70],(()=>n(556)));return e=n.O(e)},(()=>{var e=[];n.O=(t,r,a,s)=>{if(!r){var o=1/0;for(l=0;l<e.length;l++){r=e[l][0],a=e[l][1],s=e[l][2];for(var i=!0,p=0;p<r.length;p++)(!1&s||o>=s)&&Object.keys(n.O).every((e=>n.O[e](r[p])))?r.splice(p--,1):(i=!1,s<o&&(o=s));if(i){e.splice(l--,1);var d=a();void 0!==d&&(t=d)}}return t}s=s||0;for(var l=e.length;l>0&&e[l-1][2]>s;l--)e[l]=e[l-1];e[l]=[r,a,s]}})(),n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,r)=>(n.f[r](e,t),t)),[])),n.u=e=>"static/js/"+e+".5fbefa91.chunk.js",n.miniCssF=e=>{},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="/react-contenteditable-input/",(()=>{n.b=self.location+"/../../../";var e={556:1};n.f.i=(t,r)=>{e[t]||importScripts(n.p+n.u(t))};var t=self.webpackChunkmarkdown_editor_vis=self.webpackChunkmarkdown_editor_vis||[],r=t.push.bind(t);t.push=t=>{var a=t[0],s=t[1],o=t[2];for(var i in s)n.o(s,i)&&(n.m[i]=s[i]);for(o&&o(n);a.length;)e[a.pop()]=1;r(t)}})(),(()=>{var e=n.x;n.x=()=>n.e(70).then(e)})();n.x()})();
//# sourceMappingURL=556.1d9e9627.chunk.js.map