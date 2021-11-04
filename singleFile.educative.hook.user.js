// ==UserScript==
// @name         educative hook for singleFile
// @namespace    https://github.com/saksaikot/userscripts
// @version      1.0.2
// @description  educative page fix
// @author       saksaikot
// @match        *://*/*
// @noframes
// @grant        none

// ==/UserScript==

//let isMultiFile = false;
// let isMultifileProcced = false;
// if (!globalThis.singleFileUserScript) {
//   globalThis.singleFileUserScript = () => {
dispatchEvent(new CustomEvent("single-file-user-script-init"));

console.log("single-file-user-script-init");

addEventListener("single-file-on-before-capture-request", () => {
  event.preventDefault();
  // document.querySelector(".outlined-primary.m-0")

  const waitBeforeRun = setInterval(() => {
    if (document.querySelector(".ed-grid-main")) {
      clearInterval(waitBeforeRun);
      setTimeout(() => run(), 10000);
    }
  }, 1000);
  function run() {
    let codeResult = false;
    let multiFileResult = false;
    let scrolledToDown = false;
    let now = 0;
    function changeTitle() {
      //const document=unsafeWindow.document;
      console.log("change title called");
      document
        .querySelector(".flex-auto.max-h-full.overflow-y-auto.py-2")
        .querySelectorAll("a")
        .forEach((link, i) => {
          console.log(link, i);
          if (link.href === location.href) {
            document.title = `${i}. ${link.textContent}`;
            console.log("title changed");
          }
        });
    }
    const waitBeforeRunChangeTitle = setInterval(() => {
      if (
        document.querySelector(".flex-auto.max-h-full.overflow-y-auto.py-2")
      ) {
        clearInterval(waitBeforeRunChangeTitle);
        changeTitle();
      }
    }, 1000);

    function scrollSlowly() {
      const styles__RunWrap = getClassNameFromSubstring("styles__RunWrap");

      const scrollSlowlyInterval = setInterval(() => {
        now += 60;
        //console.log(scrolledToDown, now);
        if (now >= document.body.scrollHeight) {
          scrolledToDown = true;
          clearInterval(scrollSlowlyInterval);
          window.scrollTo(0, now - 200);
          if (
            document.querySelector(
              `.${styles__RunWrap} [aria-label="run code"]`
            )
          ) {
            // react code
            setIframe();
          }
          // const Widget__MultiFiles =
          //   getClassNameFromSubstring("Widget__MultiFiles");
          if (document.querySelector(`.decorationsOverviewRuler`))
            fixScrollableElements();
          // if (
          //   document.querySelectorAll(
          //     ".code-container .decorationsOverviewRuler"
          //   ).length
          // ) {
          //   overflowFix();
          // }
          const styles__Spa_Container = getClassNameFromSubstring(
            "styles__Spa_Container"
          );

          if (
            document.querySelector(
              `.${getClassNameFromSubstring(
                "styles__Spa_Container"
              )} .${getClassNameFromSubstring(
                "styles__Buttons_DownloadAndCopyButton"
              )}`
            )
          )
            downloadCode(document.title);
        }
        if (!scrolledToDown) window.scrollTo(0, now);
      }, 60);
    }
    if (
      document.querySelector(
        ".monaco-scrollable-element.editor-scrollable.vs-dark"
      )
    )
      document
        .querySelectorAll(
          ".monaco-scrollable-element.editor-scrollable.vs-dark"
        )
        .forEach((e) => (e.style.overflowX = "scroll"));
    function checkIfAllFinished() {
      const check = setInterval(() => {
        // console.log(
        //   "scrolledToDown",
        //   scrolledToDown,
        //   "codeResult",
        //   codeResult,
        //   "multiFileResult",
        //   multiFileResult
        // );
        if (scrolledToDown && !codeResult && !multiFileResult) {
          clearInterval(check);

          return dispatchEvent(
            new CustomEvent("single-file-on-before-capture-response")
          );
        }
      }, 1000);
    }

    scrollSlowly();
    checkIfAllFinished();
    console.log("single-file-on-before-capture-request");
    if (document.querySelectorAll('[aria-label="show solution"]')) {
      document
        .querySelectorAll('[aria-label="show solution"]')
        .forEach((e) => e.click());
      document
        .querySelectorAll(".text-default.py-2.m-2")
        .forEach((e) => e.click());
      //monaco-editor no-user-select
      // let codeEditorHeight = [];
      // document
      //   .querySelectorAll(".decorationsOverviewRuler")
      //   .forEach((e) => codeEditorHeight.push(+e.height + 20));
      // document
      //   .querySelectorAll(".styles__CodeEditorStyled-sc-2pjuhh-0")
      //   .forEach((e, i) => (e.style.height = codeEditorHeight[i] + "px"));
    }
    // function overflowFix() {
    //   let codeEditorHeight = [];
    //   const styles__CodeEditorStyled = getClassNameFromSubstring(
    //     "styles__CodeEditorStyled"
    //   );

    //   document
    //     .querySelectorAll(".code-container .decorationsOverviewRuler")
    //     .forEach((e) => codeEditorHeight.push(+e.height + 20));
    //   document
    //     .querySelectorAll(`.code-container .${styles__CodeEditorStyled}`)
    //     .forEach((e, i) => (e.style.height = codeEditorHeight[i] + "px"));
    // }

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
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function triggerFileDownload(fileName, fileContent) {
      // var fileContent = "This is sample text file";
      const blob = new Blob([fileContent], { type: "text/plain" });
      const a = document.createElement("a");
      a.setAttribute("download", fileName);
      a.setAttribute("href", window.URL.createObjectURL(blob));
      a.click();
    }
    function downloadCode(title) {
      const codeDownloadButtons = document.querySelectorAll(
        ".styles__Spa_Container-sc-1vx22vv-51 .styles__Buttons_DownloadAndCopyButton-sc-2pjuhh-5"
      );

      codeDownloadButtons.forEach(async (button, i) => {
        triggerFileDownload(`${title}-${i}.txt`, "");
        fireClick(button.children[1]);
        await sleep(15000);
      });
    }
    function fixScrollableElements() {
      let codeViewHeight = [];
      let codeEditorHeight = [];

      const Widget__MultiFiles =
        getClassNameFromSubstring("Widget__MultiFiles");
      const styles__CodeEditorStyled = getClassNameFromSubstring(
        "styles__CodeEditorStyled"
      );
      const styles__CodeWrap = getClassNameFromSubstring("styles__CodeWrap");
      const styles__FileTree = getClassNameFromSubstring("styles__FileTree");

      document
        .querySelectorAll(`.decorationsOverviewRuler`)
        .forEach((e) => codeEditorHeight.push(+e.height + 20));
      document
        .querySelectorAll(`.view-lines.monaco-mouse-cursor-text`)
        .forEach((e) => codeViewHeight.push(+e.style.height.replace("px", "")));

      setHeightToElement(`.${Widget__MultiFiles}`);
      setHeightToElement(`.${styles__CodeEditorStyled}`);
      setHeightToElement(`.${styles__CodeWrap}`);
      setHeightToElement(`.monaco-editor`);
      setHeightToElement(`.${styles__FileTree}`);
      setHeightToElement(
        `.h-full.w-full.bg-gray-A900.flex.flex-col.h-full.overflow-x-scroll.overflow-y-hidden.block`
      );

      function setHeightToElement(selector) {
        document.querySelectorAll(selector).forEach((e, i) => {
          const height = codeViewHeight[i] + 20 + "px";
          e.style.height = height;
          e.height = height;
          e.style.maxHeight = height;
        });
      }
    }

    document.querySelectorAll(".gcoVHD").forEach((e) => e.click());

    const runCode = document.querySelectorAll(
      '.code-container [aria-label="run code"]'
    );
    let runCodeExecute = false;
    if (runCode.length > 0) {
      codeResult = true;
      runCode.forEach((e) => e.click());
      runCodeExecute = true;
      let secondCounter = 0;
      const checkResultLoaded = setInterval(() => {
        let count = 0;
        document.querySelectorAll(".runnable-enter-done").forEach((e) => {
          if (
            !e.textContent.includes("Executing your code...") &&
            e.textContent.length > 2
          )
            count++;
        });
        if (runCode.length == count || secondCounter > 35) {
          clearInterval(checkResultLoaded);
          codeResult = false;
          //dispatchEvent(new CustomEvent("single-file-on-before-capture-response"));
        }
        secondCounter++;
      }, 500);
    } else {
      codeResult = false;
      // setTimeout(()=>dispatchEvent(new CustomEvent("single-file-on-before-capture-response")),4000);
    }

    //aria-label="show solution"

    function quizExtend() {
      function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(
          newNode,
          referenceNode.nextSibling
        );
      }
      const Widget__ControlPanel = getClassNameFromSubstring(
        "Widget__ControlPanel"
      );
      const styles__SlideRightButton = getClassNameFromSubstring(
        "styles__SlideRightButton"
      );
      const styles__QuestionSlideRendererStyled = getClassNameFromSubstring(
        "styles__QuestionSlideRendererStyled"
      );
      const quizLimit =
        +document.querySelectorAll(`.${Widget__ControlPanel} span`)[1]
          .childNodes[3].data || 1;
      for (let i = 1; i < quizLimit; i++) {
        if (document.querySelector(`.${styles__SlideRightButton}`).disabled)
          break;
        const q = document.querySelector(
          `.${styles__QuestionSlideRendererStyled}`
        );
        const q2 = q.cloneNode(true);
        insertAfter(q2, q);
        document.querySelector(`.${styles__SlideRightButton}`).click();
      }
    }
    const Widget__ControlPanel = getClassNameFromSubstring(
      "Widget__ControlPanel"
    );

    if (document.querySelectorAll(`.${Widget__ControlPanel} span`).length > 3)
      quizExtend();

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
  }
});

addEventListener("single-file-on-after-capture-request", () => {
  console.log("single-file-on-after-capture-request");
  //select not completed

  if (document.querySelector(".leading-5"))
    document.querySelector(".leading-5").click();

  if (document.querySelector(".outlined-primary.m-0"))
    document.querySelector(".outlined-primary.m-0").click();
});
