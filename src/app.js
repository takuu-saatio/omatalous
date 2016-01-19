"use strict";

console.log("PRESTARTING APP.....");

import "babel-core/polyfill";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import Router from "./site/router";
import Location from "./core/Location";
import { addEventListener, removeEventListener } from "./core/DOMUtils";
import { canUseDOM } from "fbjs/lib/ExecutionEnvironment";

let cssContainer = document.getElementById("css");
const appContainer = document.getElementById("app");
let firstLoad = true;

console.log("STARTING APP.....");
if (canUseDOM && !window.Intl) {
  console.log("POLYFILLING INTL");
  require("intl");
}

const context = {

  insertCss: styles => styles._insertCss(),
  onSetTitle: value => document.title = value,
  onSetMeta: (name, content) => {

    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName("meta");
    [].slice.call(elements).forEach((element) => {
      if (element.getAttribute("name") === name) {
        element.parentNode.removeChild(element);
      }
    });

    const meta = document.createElement("meta");
    meta.setAttribute("name", name);
    meta.setAttribute("content", content);
    document.getElementsByTagName("head")[0].appendChild(meta);

  }

};

function render(state) {

  Router.dispatch(state, (newState, component) => {

    //console.log("dispatching, reload=", component, newState);
    ReactDOM.render(component, appContainer, () => {

      // Restore the scroll position if it was saved into the state
      if (state.scrollY !== undefined) {
        window.scrollTo(state.scrollX, state.scrollY);
      } else {
        window.scrollTo(0, 0);
      }

      // Remove the pre-rendered CSS because it"s no longer used
      // after the React app is launched
      if (cssContainer) {
        cssContainer.parentNode.removeChild(cssContainer);
        cssContainer = null;
      }

    });

  });

}

function run() {

  let currentLocation = null;
  let currentState = null;

  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  // Re-render the app when window.location changes
  const unlisten = Location.listen(location => {

    //console.log("rerender", location);
    currentLocation = location;
    currentState = Object.assign({}, location.state, {
      path: location.pathname,
      query: location.query,
      state: location.state,
      context,
    });

    if (firstLoad) {
      render(currentState);
      firstLoad = false;
    }

  });

  // Save the page scroll position into the current location"s state
  const supportPageOffset = window.pageXOffset !== undefined;
  const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  const setPageOffset = () => {
    currentLocation.state = currentLocation.state || Object.create(null);
    if (supportPageOffset) {
      currentLocation.state.scrollX = window.pageXOffset;
      currentLocation.state.scrollY = window.pageYOffset;
    } else {
      currentLocation.state.scrollX = isCSS1Compat ?
        document.documentElement.scrollLeft : document.body.scrollLeft;
      currentLocation.state.scrollY = isCSS1Compat ?
        document.documentElement.scrollTop : document.body.scrollTop;
    }
  };

  addEventListener(window, "scroll", setPageOffset);
  addEventListener(window, "pagehide", () => {
    removeEventListener(window, "scroll", setPageOffset);
    unlisten();
  });

}

// Run the application when both DOM is ready and page content is loaded
if (["complete", "loaded", "interactive"].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener("DOMContentLoaded", run, false);
}
