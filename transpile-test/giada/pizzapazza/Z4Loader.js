/* global String, URLSearchParams, XMLHttpRequest, Z4Loader */

/**
 * The loader
 *
 * @author gianpiero.di.blasi
 */
class Z4Loader {

  static  onLoad() {
    window.onload = (event) => {
      let jsFile = window.location.href.substring(window.location.href.lastIndexOf('/') + 1).replace(".html", ".js");
      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("allFiles")) {
        let client = new XMLHttpRequest();
        client.open("GET", "../../../../css_list.properties", false);
        client.onreadystatechange = (event2) => {
          if (client.readyState === 4 && client.status === 200) {
            new String(client.responseText).split("\n").forEach(row => {
              if (row && !row.startsWith("#")) {
                let cssRow = document.createElement("link");
                cssRow.setAttribute("rel", "stylesheet");
                cssRow.setAttribute("href", "../../../../" + row);
                document.querySelector("head").appendChild(cssRow);
              }
            });
          }
          return null;
        };
        client.send();
        client.open("GET", "../../../../js_list.properties", false);
        client.onreadystatechange = (event2) => {
          if (client.readyState === 4 && client.status === 200) {
            let scripts = new String(client.responseText).split("\n");
            Z4Loader.loadScripts(scripts, jsFile.substring(0, jsFile.lastIndexOf('?')));
          }
          return null;
        };
        client.send();
      } else {
        let cssBundle = document.createElement("link");
        cssBundle.setAttribute("rel", "stylesheet");
        cssBundle.setAttribute("href", "../../../../build/bundle.min.css");
        document.querySelector("head").appendChild(cssBundle);
        let scriptBundle = document.createElement("script");
        scriptBundle.setAttribute("src", "../../../../build/bundle.min.js");
        scriptBundle.setAttribute("type", "text/javascript");
        scriptBundle.setAttribute("async", "false");
        document.querySelector("head").appendChild(scriptBundle);
        Z4Loader.loadScript(jsFile);
      }
      return null;
    };
  }

  static  loadScripts(scripts, jsFile) {
    if (scripts.length > 0) {
      let row = scripts[0];
      if (row && !row.startsWith("#")) {
        let scriptRow = document.createElement("script");
        scriptRow.setAttribute("id", row.substring(row.lastIndexOf("/") + 1).toString());
        scriptRow.setAttribute("src", "../../../../" + row);
        scriptRow.setAttribute("type", "text/javascript");
        scriptRow.setAttribute("async", "false");
        scriptRow.addEventListener("load", (event) => {
          Z4Loader.loadScripts(scripts.slice(1), jsFile);
        });
        document.querySelector("head").appendChild(scriptRow);
      } else {
        Z4Loader.loadScripts(scripts.slice(1), jsFile);
      }
    } else {
      Z4Loader.loadScript(jsFile);
    }
  }

  static  loadScript(jsFile) {
    let script = document.createElement("script");
    script.setAttribute("src", "color/" + jsFile);
    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", "false");
    document.querySelector("head").appendChild(script);
  }

  constructor() {
  }
}
