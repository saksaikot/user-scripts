function getClassNameFromSubstring(substring) {
  var allClasses = [];

  var allElements = document.querySelectorAll("*");

  for (var i = 0; i < allElements.length; i++) {
    var classes = allElements[i].className.toString().split(/\s+/);
    for (var j = 0; j < classes.length; j++) {
      var cls = classes[j];
      if (cls && allClasses.indexOf(cls) === -1) allClasses.push(cls);
    }
  }
  let className = false;
  for (let index = 0; index < allClasses.length; index++) {
    if (allClasses[index].includes(substring)) {
      className = allClasses[index];
      break;
    }
  }
  return className;
}
function fireClick(node) {
  if (document.createEvent) {
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, false);
    node.dispatchEvent(evt);
  } else if (document.createEventObject) {
    node.fireEvent("onclick");
  } else if (typeof node.onclick == "function") {
    node.onclick();
  }
}

// document.querySelectorAll(
//   `.styles__RunWrap-sc-1vx22vv-5 [aria-label="run code"]`
// );
function setIframe() {
  multiFileResult = true;

  const styles__RunWrap = getClassNameFromSubstring("styles__RunWrap");
  console.log(styles__RunWrap);
  const runCode = document.querySelectorAll(
    `.${styles__RunWrap} [aria-label="run code"]`
  );
  //if (!runCodeExecute)
  let totalLoad = 0;
  runCode.forEach(async (e) => {
    console.log(e);
    //fireClick(e);
    e.click();
    await new Promise((resolveRunCode, reject) => {
      //console.log(e);
      const iframeParent =
        e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode;
      const waitForIframe = setInterval(async () => {
        // console.log("iframe not found")
        if (iframeParent.querySelector('[title="output-iframe"]')) {
          clearInterval(waitForIframe);
          const iframeNode = iframeParent.querySelector(
            '[title="output-iframe"]'
          );
          console.log(iframeNode, "iframeNode");
          await new Promise((resolve, reject) => {
            iframeNode.addEventListener("load", () => {
              setTimeout(() => {
                totalLoad++;
                console.log(
                  totalLoad,
                  "totalLoad",
                  runCode.length,
                  "runCode.length"
                );
                if (totalLoad == runCode.length) multiFileResult = false;
                iframeNode.parentNode.style.overflow = "auto";
                iframeNode.parentNode.innerHTML = GM_Frame;

                resolve();
              }, 6000);
            });
          });
          resolveRunCode();
        }
      }, 100);
    });
  });
}
setIframe();
