// ==UserScript==
// @name         educative hook for singleFile
// @namespace    https://github.com/saksaikot/userscripts
// @version      1.0
// @description  educative page fix
// @author       saksaikot
// @match        *://*/*
// @noframes
// @grant        none

// ==/UserScript==

let isMultiFile = false;
let isMultifileProcced = false;
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
      const scrollSlowlyInterval = setInterval(() => {
        now += 60;
        //console.log(scrolledToDown, now);
        if (now >= document.body.scrollHeight) {
          scrolledToDown = true;
          clearInterval(scrollSlowlyInterval);
          window.scrollTo(0, now - 200);
          if (
            document.querySelector(
              ".styles__Spa_Container-sc-1vx22vv-60.dPYRBS"
            )
          ) {
            // react code
            setIframe();
            fixMultiFile();
          }
        }
        if (!scrolledToDown) window.scrollTo(0, now);
      }, 60);
    }
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
    function overflowFix() {
      let codeEditorHeight = [];
      document
        .querySelectorAll(".decorationsOverviewRuler")
        .forEach((e) => codeEditorHeight.push(+e.height + 20));
      document
        .querySelectorAll(".styles__CodeEditorStyled-sc-2pjuhh-0")
        .forEach((e, i) => (e.style.height = codeEditorHeight[i] + "px"));
    }
    if (document.querySelectorAll(".decorationsOverviewRuler").length) {
      overflowFix();
    }
    function fixMultiFile() {
      let codeViewHeight = [];
      let codeEditorHeight = [];
      document
        .querySelectorAll(
          ".Widget__MultiFiles-csjrsw-6 .decorationsOverviewRuler"
        )
        .forEach((e) => codeEditorHeight.push(+e.height + 20));
      document
        .querySelectorAll(
          ".Widget__MultiFiles-csjrsw-6 .view-lines.monaco-mouse-cursor-text"
        )
        .forEach((e) => codeViewHeight.push(+e.style.height.replace("px", "")));

      setHeightToElement(".Widget__MultiFiles-csjrsw-6");
      setHeightToElement(
        ".Widget__MultiFiles-csjrsw-6 .styles__CodeEditorStyled-sc-2pjuhh-0"
      );
      setHeightToElement(
        ".Widget__MultiFiles-csjrsw-6 .styles__CodeWrap-sc-1vx22vv-5"
      );
      setHeightToElement(".Widget__MultiFiles-csjrsw-6 .monaco-editor");
      setHeightToElement(
        ".Widget__MultiFiles-csjrsw-6 .styles__FileTree-sc-1vx22vv-29"
      );
      setHeightToElement(
        ".Widget__MultiFiles-csjrsw-6 .h-full.w-full.bg-gray-A900.flex.flex-col.h-full.overflow-x-scroll.overflow-y-hidden.block"
      );

      function setHeightToElement(selector) {
        document.querySelectorAll(selector).forEach((e, i) => {
          const height = codeViewHeight[i] + "px";
          e.style.height = height;
          e.height = height;
          e.style.maxHeight = height;
        });
      }
    }
    fixMultiFile();

    // if (!document.querySelectorAll(".code-container").length)
    //   if (
    //     document.querySelectorAll(".Widget__MultiFiles-csjrsw-6").length
    //   ) {
    //     console.log("fixMultiFile run");
    //     fixMultiFile();
    //   }

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
      const quizLimit =
        +document.querySelectorAll(".Widget__ControlPanel-csjrsw-1 span")[1]
          .childNodes[3].data || 1;
      for (let i = 1; i < quizLimit; i++) {
        if (
          document.querySelector(".styles__SlideRightButton-sc-1maq1zy-3")
            .disabled
        )
          break;
        const q = document.querySelector(
          ".styles__QuestionSlideRendererStyled-sc-1maq1zy-0"
        );
        const q2 = q.cloneNode(true);
        insertAfter(q2, q);
        document
          .querySelector(".styles__SlideRightButton-sc-1maq1zy-3")
          .click();
      }
    }
    if (
      document.querySelectorAll(".Widget__ControlPanel-csjrsw-1 span").length >
      3
    )
      quizExtend();

    function setIframe() {
      multiFileResult = true;
      const runCode = document.querySelectorAll(
        '.styles__SpaStyled-sc-1vx22vv-0.fnxkrd [aria-label="run code"]'
      );
      //if (!runCodeExecute)
      let totalLoad = 0;
      runCode.forEach(async (e) => {
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
//   };
// }
// globalThis.singleFileUserScript();

// function getResultFromRunCode() {
//   // multiFileResult = true;
//   const runCode = document.querySelectorAll('[aria-label="run code"]');
//   runCode.forEach((e) => e.click());
//   let totalLoad = 0;
//   const isFrameLoaded = setInterval(() => {
//     if (
//       document.querySelectorAll('[title="output-iframe"]').length ===
//       runCode.length
//     ) {
//       clearInterval(isFrameLoaded);
//       document
//         .querySelectorAll('[title="output-iframe"]')
//         .forEach((e) =>
//           e.addEventListener("load", () => {
//             totalLoad++;
//             if (totalLoad == runCode.length) {
//               console.log("done loading");
//               window.scrollTo(0, 0);
//               now = 0;
//               scrolledToDown = false;
//               setTimeout(() => {
//                 multiFileResult = false;
//               }, 20000);
//             }
//           })
//         );
//     }
//   }, 200);
// }
