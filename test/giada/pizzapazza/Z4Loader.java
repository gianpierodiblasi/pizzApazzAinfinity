package giada.pizzapazza;

import static def.dom.Globals.document;
import static def.dom.Globals.window;
import def.dom.HTMLElement;
import def.dom.XMLHttpRequest;
import def.js.Array;
import static simulation.js.$Globals.$exists;
import simulation.js.$String;
import simulation.js.$URLSearchParams;

/**
 * The loader
 *
 * @author gianpiero.di.blasi
 */
public class Z4Loader {

  public static void onLoad() {
    window.onload = (event) -> {
      final String jsFile = window.location.href.substring(window.location.href.lastIndexOf('/') + 1).replace(".html", ".js");

      $URLSearchParams urlParams = new $URLSearchParams(window.location.search);
      if (urlParams.get("allFiles")) {
        XMLHttpRequest client = new XMLHttpRequest();
        client.open("GET", "../../../../css_list.properties", false);
        client.onreadystatechange = (event2) -> {
          if (client.readyState == 4 && client.status == 200) {
            new $String(client.responseText).split("\n").forEach(row -> {
              if ($exists(row) && !row.startsWith("#")) {
                HTMLElement cssRow = document.createElement("link");
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
        client.onreadystatechange = (event2) -> {
          if (client.readyState == 4 && client.status == 200) {
            Array<def.js.String> scripts = new $String(client.responseText).split("\n");
            Z4Loader.loadScripts(scripts, jsFile.substring(0, jsFile.lastIndexOf('?')));
          }
          return null;
        };
        client.send();
      } else {
        HTMLElement cssBundle = document.createElement("link");
        cssBundle.setAttribute("rel", "stylesheet");
        cssBundle.setAttribute("href", "../../../../build/bundle.min.css");
        document.querySelector("head").appendChild(cssBundle);

        HTMLElement scriptBundle = document.createElement("script");
        scriptBundle.setAttribute("src", "../../../../build/bundle.min.js");
        scriptBundle.setAttribute("type", "text/javascript");
        scriptBundle.setAttribute("async", "false");
        document.querySelector("head").appendChild(scriptBundle);

        Z4Loader.loadScript(jsFile);
      }
      return null;
    };
  }

  private static void loadScripts(Array<def.js.String> scripts, String jsFile) {
    if (scripts.length > 0) {
      def.js.String row = scripts.$get(0);
      if ($exists(row) && !row.startsWith("#")) {
        HTMLElement scriptRow = document.createElement("script");
        scriptRow.setAttribute("id", row.substring(row.lastIndexOf("/") + 1).toString());
        scriptRow.setAttribute("src", "../../../../" + row);
        scriptRow.setAttribute("type", "text/javascript");
        scriptRow.setAttribute("async", "false");
        scriptRow.addEventListener("load", (event) -> {
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

  private static void loadScript(String jsFile) {
    HTMLElement script = document.createElement("script");
    script.setAttribute("src", "color/" + jsFile);
    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", "false");
    document.querySelector("head").appendChild(script);
  }

  private Z4Loader() {
  }
}
