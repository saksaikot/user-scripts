// ==UserScript==
// @name        singleFile_educative_iframe_data_collect
// @namespace    https://github.com/saksaikot/userscripts
// @match        *://*.educative.*
// @grant    GM_getValue

// @grant    GM_setValue

// ==/UserScript==
if (window.top === window.self) {
  setInterval(() => (unsafeWindow.GM_Frame = GM_getValue("frame")), 1000);
} else {
  document.addEventListener("load", () => {
    console.log("frame loaded");
    setTimeout(() => {
      console.log("saving frame");
      GM_setValue("frame", new XMLSerializer().serializeToString(document));
    }, 4000);
  });
  window.addEventListener("load", () => {
    console.log("frame loaded");
    setTimeout(() => {
      console.log("saving frame");
      GM_setValue("frame", new XMLSerializer().serializeToString(document));
    }, 4000);
  });
}

console.log("_Calling iframe");
