(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[584],{2004:function(e,t,n){Promise.resolve().then(n.bind(n,7485))},357:function(e,t,n){"use strict";var r,s;e.exports=(null==(r=n.g.process)?void 0:r.env)&&"object"==typeof(null==(s=n.g.process)?void 0:s.env)?n.g.process:n(8081)},8081:function(e){!function(){var t={229:function(e){var t,n,r,s=e.exports={};function l(){throw Error("setTimeout has not been defined")}function o(){throw Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===l||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:l}catch(e){t=l}try{n="function"==typeof clearTimeout?clearTimeout:o}catch(e){n=o}}();var a=[],c=!1,d=-1;function u(){c&&r&&(c=!1,r.length?a=r.concat(a):d=-1,a.length&&f())}function f(){if(!c){var e=i(u);c=!0;for(var t=a.length;t;){for(r=a,a=[];++d<t;)r&&r[d].run();d=-1,t=a.length}r=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===o||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}s.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];a.push(new h(e,t)),1!==a.length||c||i(f)},h.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=m,s.addListener=m,s.once=m,s.off=m,s.removeListener=m,s.removeAllListeners=m,s.emit=m,s.prependListener=m,s.prependOnceListener=m,s.listeners=function(e){return[]},s.binding=function(e){throw Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw Error("process.chdir is not supported")},s.umask=function(){return 0}}},n={};function r(e){var s=n[e];if(void 0!==s)return s.exports;var l=n[e]={exports:{}},o=!0;try{t[e](l,l.exports,r),o=!1}finally{o&&delete n[e]}return l.exports}r.ab="//";var s=r(229);e.exports=s}()},551:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return l}});let r=n(9920);n(7437),n(2265);let s=r._(n(148));function l(e,t){var n;let r={loading:e=>{let{error:t,isLoading:n,pastDelay:r}=e;return null}};"function"==typeof e&&(r.loader=e);let l={...r,...t};return(0,s.default)({...l,modules:null==(n=l.loadableGenerated)?void 0:n.modules})}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},912:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"BailoutToCSR",{enumerable:!0,get:function(){return s}});let r=n(5592);function s(e){let{reason:t,children:n}=e;if("undefined"==typeof window)throw new r.BailoutToCSRError(t);return n}},148:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return c}});let r=n(7437),s=n(2265),l=n(912),o=n(1481);function i(e){return{default:e&&"default"in e?e.default:e}}let a={loader:()=>Promise.resolve(i(()=>null)),loading:null,ssr:!0},c=function(e){let t={...a,...e},n=(0,s.lazy)(()=>t.loader().then(i)),c=t.loading;function d(e){let i=c?(0,r.jsx)(c,{isLoading:!0,pastDelay:!0,error:null}):null,a=t.ssr?(0,r.jsxs)(r.Fragment,{children:["undefined"==typeof window?(0,r.jsx)(o.PreloadCss,{moduleIds:t.modules}):null,(0,r.jsx)(n,{...e})]}):(0,r.jsx)(l.BailoutToCSR,{reason:"next/dynamic",children:(0,r.jsx)(n,{...e})});return(0,r.jsx)(s.Suspense,{fallback:i,children:a})}return d.displayName="LoadableComponent",d}},1481:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"PreloadCss",{enumerable:!0,get:function(){return l}});let r=n(7437),s=n(8512);function l(e){let{moduleIds:t}=e;if("undefined"!=typeof window)return null;let n=(0,s.getExpectedRequestStore)("next/dynamic css"),l=[];if(n.reactLoadableManifest&&t){let e=n.reactLoadableManifest;for(let n of t){if(!e[n])continue;let t=e[n].files.filter(e=>e.endsWith(".css"));l.push(...t)}}return 0===l.length?null:(0,r.jsx)(r.Fragment,{children:l.map(e=>(0,r.jsx)("link",{precedence:"dynamic",rel:"stylesheet",href:n.assetPrefix+"/_next/"+encodeURI(e),as:"style"},e))})}},4787:function(e,t,n){"use strict";var r=n(7437);n(2265);var s=n(357);t.Z=function(){let e=s.env.NEXT_PUBLIC_BASE_PATH||"";return(0,r.jsx)("div",{className:"h-screen w-screen overflow-hidden",children:(0,r.jsx)("img",{src:"".concat(e,"/admin_dashboard.png"),className:"object-cover w-full h-full"})})}},3522:function(e,t,n){"use strict";var r=n(7437),s=n(2265),l=n(357);t.Z=()=>{let e=l.env.NEXT_PUBLIC_BASE_PATH||"",[t,n]=(0,s.useState)(!1),o=(0,s.useRef)(null),i=()=>{n(!t)},a=e=>{o.current&&!o.current.contains(e.target)&&n(!1)};return(0,s.useEffect)(()=>(document.addEventListener("mousedown",a),()=>{document.removeEventListener("mousedown",a)}),[]),(0,s.useEffect)(()=>{let e;let r=t=>{e=t.touches[0].clientX},s=r=>{if(!e)return;let s=r.touches[0].clientX-e;s>50&&!t?n(!0):s<-50&&t&&n(!1)};return document.addEventListener("touchstart",r),document.addEventListener("touchmove",s),()=>{document.removeEventListener("touchstart",r),document.removeEventListener("touchmove",s)}},[t]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("button",{onClick:i,className:"lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-red-900 text-white transition-transform duration-300 ".concat(t?"hidden":"opacity-100"),children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"currentColor",className:"w-6 h-6",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5"})})}),(0,r.jsx)("div",{ref:o,className:"fixed lg:relative h-full md:h-full px-1 shadow-md py-3 w-64 bg-red-900 md:bg-red-950 rounded-xl p-4 z-10 transition-transform duration-300 ".concat(t?"transform translate-x-0":"transform -translate-x-full"," lg:translate-x-0"),children:(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("button",{onClick:i,className:"lg:hidden p-2 text-white mb-3 w-9",children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"currentColor",className:"w-6 h-6",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})}),(0,r.jsxs)("div",{className:"flex flex-col flex-1",children:[(0,r.jsxs)("div",{className:"flex flex-row items-center justify-center",children:[(0,r.jsx)("img",{src:"".concat(e,"/logon1.png"),className:"w-11 h-10 md:w-13 md:h-12",alt:"Logo"}),(0,r.jsx)("p",{className:"text-white font-semibold text-xs md:text-sm px-2",children:"Batangas State University"})]}),(0,r.jsx)("div",{className:"flex justify-center",children:(0,r.jsx)("hr",{className:"border-t-1 border-white w-64 my-3 md:my-5"})}),(0,r.jsxs)("ul",{className:"space-y-2 mx-4 font-medium flex-1",children:[(0,r.jsx)("li",{children:(0,r.jsxs)("a",{href:"/pages/admin/maps",className:"flex items-center p-2 hover:text-red-950 rounded-lg text-white hover:bg-white",children:[(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-4 md:size-6 hover:text-red-950",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z",clipRule:"evenodd"})}),(0,r.jsx)("span",{className:"ms-3 text-xs md:text-base",children:"Map Dashboard"})]})}),(0,r.jsx)("li",{children:(0,r.jsxs)("a",{href:"/pages/admin/accounts",className:"flex items-center p-2 hover:text-red-950 rounded-lg text-white hover:bg-white",children:[(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-4 md:size-6 hover:text-red-950",children:[(0,r.jsx)("path",{fillRule:"evenodd",d:"M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z",clipRule:"evenodd"}),(0,r.jsx)("path",{d:"M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"})]}),(0,r.jsx)("span",{className:"flex-1 ms-3 whitespace-nowrap text-xs md:text-base",children:"Accounts"})]})}),(0,r.jsx)("li",{children:(0,r.jsxs)("button",{onClick:()=>{localStorage.removeItem("adminToken"),window.location.href="/pages/admin/login"},className:"flex items-center p-2 md:p-3 hover:text-red-950 rounded-lg text-white hover:bg-white w-full text-left",children:[(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-4 md:size-6 hover:text-red-950",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z",clipRule:"evenodd"})}),(0,r.jsx)("span",{className:"flex-1 ms-3 whitespace-nowrap text-xs md:text-base",children:"Log-Out"})]})})]})]})]})})]})}},7485:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return u}});var r=n(7437),s=n(551),l=n.n(s),o=n(2265),i=n(9714),a=n(3522),c=n(4787);let d=l()(()=>Promise.all([n.e(733),n.e(370),n.e(212),n.e(472),n.e(940)]).then(n.bind(n,6940)),{loadableGenerated:{webpack:()=>[6940]},ssr:!1});var u=function(){let[e,t]=(0,o.useState)(null);return(0,o.useEffect)(()=>{let e=localStorage.getItem("adminToken");if(e)try{let n=(0,i.o)(e),r=Date.now()/1e3;n.exp<r?(localStorage.removeItem("adminToken"),window.location.href="/pages/admin/login"):t(e)}catch(e){localStorage.removeItem("adminToken"),window.location.href="/pages/admin/login"}else window.location.href="/pages/admin/login"},[]),(0,r.jsxs)("div",{className:"relative h-screen w-screen",children:[(0,r.jsx)("div",{className:"absolute inset-0 z-0",children:(0,r.jsx)(c.Z,{})}),(0,r.jsxs)("div",{className:"flex flex-col md:flex-row h-full",children:[(0,r.jsx)("div",{className:"relative z-20 md:p-4",children:(0,r.jsx)(a.Z,{})}),(0,r.jsxs)("div",{className:"relative p-4 w-full flex-1",children:[(0,r.jsxs)("div",{className:"mt-12 md:mt-3",children:[(0,r.jsx)("p",{className:"font-medium text-white text-sm mb-5",children:"Pages/ Map Dashboard"}),(0,r.jsx)("h1",{className:"font-semibold text-white text-md",children:"Map Dashboard"})]}),(0,r.jsx)("div",{className:"w-full h-64 my-7",children:e&&(0,r.jsx)(d,{adminToken:e})})]})]})]})}},9714:function(e,t,n){"use strict";n.d(t,{o:function(){return s}});class r extends Error{}function s(e,t){let n;if("string"!=typeof e)throw new r("Invalid token specified: must be a string");t||(t={});let s=!0===t.header?0:1,l=e.split(".")[s];if("string"!=typeof l)throw new r(`Invalid token specified: missing part #${s+1}`);try{n=function(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw Error("base64 string is not of the correct length")}try{var n;return n=t,decodeURIComponent(atob(n).replace(/(.)/g,(e,t)=>{let n=t.charCodeAt(0).toString(16).toUpperCase();return n.length<2&&(n="0"+n),"%"+n}))}catch(e){return atob(t)}}(l)}catch(e){throw new r(`Invalid token specified: invalid base64 for part #${s+1} (${e.message})`)}try{return JSON.parse(n)}catch(e){throw new r(`Invalid token specified: invalid json for part #${s+1} (${e.message})`)}}r.prototype.name="InvalidTokenError"}},function(e){e.O(0,[971,23,744],function(){return e(e.s=2004)}),_N_E=e.O()}]);