function fixScrollableElements() {
  let codeViewHeight = [];
  let codeEditorHeight = [];

  const Widget__MultiFiles = getClassNameFromSubstring("Widget__MultiFiles");
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
fixScrollableElements();

document
  .querySelectorAll(`.${getClassNameFromSubstring("styles__ConfirmPopover")}`)
  .forEach((e) => e.children[2].children[0].click());
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
