/* global String, URLSearchParams, XMLHttpRequest, Z4Loader */

/**
 * The loader
 *
 * @author gianpiero.di.blasi
 */
class Z4Loader {

  /**
   * The up path
   */
  static  UP = null;

  /**
   * The onLoad method
   *
   * @param level The level where the onLoad starts
   */
  static  onLoad(level) {
    Z4Loader.UP = "";
    for (let i = 0; i < level; i++) {
      Z4Loader.UP += "../";
    }
    window.onload = (event) => {
      let jsFile = window.location.href.substring(window.location.href.lastIndexOf('/') + 1).replace(".html", ".js");
      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("allFiles")) {
        let client = new XMLHttpRequest();
        client.open("GET", Z4Loader.UP + "css_list.properties", false);
        client.send();
        new String(client.responseText).split("\n").forEach(row => {
          if (row && !row.startsWith("#")) {
            let cssRow = document.createElement("link");
            cssRow.setAttribute("rel", "stylesheet");
            cssRow.setAttribute("href", Z4Loader.UP + "" + row);
            document.querySelector("head").appendChild(cssRow);
          }
        });
        client.open("GET", Z4Loader.UP + "js_list.properties", false);
        client.send();
        let scripts = new String(client.responseText).split("\n");
        Z4Loader.loadScripts(scripts, jsFile.substring(0, jsFile.lastIndexOf('?')));
      } else {
        let cssBundle = document.createElement("link");
        cssBundle.setAttribute("rel", "stylesheet");
        cssBundle.setAttribute("href", Z4Loader.UP + "build/bundle.min.css");
        document.querySelector("head").appendChild(cssBundle);
        let scriptBundle = document.createElement("script");
        scriptBundle.setAttribute("src", Z4Loader.UP + "build/bundle.min.js");
        scriptBundle.setAttribute("type", "text/javascript");
        scriptBundle.setAttribute("async", "false");
        scriptBundle.addEventListener("load", (event2) => Z4Loader.loadScript(jsFile));
        document.querySelector("head").appendChild(scriptBundle);
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
        scriptRow.setAttribute("src", Z4Loader.UP + "" + row);
        scriptRow.setAttribute("type", "text/javascript");
        scriptRow.setAttribute("async", "false");
        scriptRow.addEventListener("load", (event) => Z4Loader.loadScripts(scripts.slice(1), jsFile));
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
    script.setAttribute("src", jsFile);
    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", "false");
    script.addEventListener("load", (event) => {
      let script2 = document.createElement("script");
      script2.setAttribute("type", "text/javascript");
      script2.innerText = jsFile.replace(".js", "") + ".onLoad();";
      document.querySelector("head").appendChild(script2);
    });
    document.querySelector("head").appendChild(script);
  }

  constructor() {
  }
}
