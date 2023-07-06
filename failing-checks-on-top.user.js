// ==UserScript==
// @name        Put failing checks in Github PR on top
// @version     1.0.0
// @description A userscript that sorts Github PR checks
// @author      Ivan Dyachkov
// @namespace   https://github.com/id
// @include     https://github.com/*/*/pull/*
// @run-at      document-end
// ==/UserScript==
(() => {
	"use strict";

  function moveOnTop(className) {
    document.querySelectorAll(".merge-status-item").forEach((check) => {
      const icon = check.querySelector(".merge-status-icon > svg");
      const parent = check.parentElement;

      if (icon && icon.classList.contains(className)) {
        console.log("Moving check to the top");
        parent.removeChild(check);
        parent.prepend(check);
      }
    });
  }

  function reorderChecks() {
    moveOnTop("anim-rotate");
    moveOnTop("octicon-skip");
    moveOnTop("octicon-x");
  }

  var config = { childList: true, subtree: true, attributes: true };

  var observer = new MutationObserver(function(mutations) {
      var lastRemoved = null;
      mutations.forEach(function(mutation) {
          console.log(mutation);
          if (mutation.type === "childList" && mutation.removedNodes.length === 1) {
              lastRemoved = mutation.removedNodes[0];
          } else if (mutation.type === "childList" && mutation.addedNodes.length === 1) {
              var thisRemoved = mutation.addedNodes[0];
              if (thisRemoved === lastRemoved) {
                  lastRemoved = null;
              } else {
                  reorderChecks();
              }
          }
          //reorderChecks();
      });
  });

  function maybeWait() {
    if (document.querySelectorAll(".merge-status-item").length === 0) {
      setTimeout(() => maybeWait(), 100);
    } else {
      let statusList = document.querySelectorAll(".merge-status-list")[0];
      observer.observe(statusList, config);
      reorderChecks();
    }
  }

  maybeWait();
})();
