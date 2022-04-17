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

  /**
   * The up path
   */
  public static String UP;

  /**
   * true if the allFiles query parameter is present, false otherwise
   */
  public static boolean allFiles;

  /**
   * The application path
   */
  public static String path;

  /**
   * The onLoad method
   *
   * @param level The level where the onLoad starts
   */
  public static void onLoad(int level) {
    window.onload = (event) -> {
      Z4Loader.UP = "";
      for (int i = 0; i < level; i++) {
        Z4Loader.UP += "../";
      }

      $URLSearchParams urlParams = new $URLSearchParams(window.location.search);
      Z4Loader.allFiles = urlParams.get("allFiles");

      int start = window.location.href.indexOf('/', 10);
      int end = window.location.href.indexOf('/', start + 1);
      Z4Loader.path = window.location.href.substring(start, end);

      String jsFile = window.location.href.substring(window.location.href.lastIndexOf('/') + 1).replace(".html", ".js");

      if (Z4Loader.allFiles) {
        XMLHttpRequest client = new XMLHttpRequest();
        client.open("GET", Z4Loader.UP + "css_list.properties", false);
        client.send();

        new $String(client.responseText).split("\n").forEach(row -> {
          if ($exists(row) && !row.startsWith("#")) {
            HTMLElement cssRow = document.createElement("link");
            cssRow.setAttribute("rel", "stylesheet");
            cssRow.setAttribute("href", Z4Loader.UP + row);
            document.querySelector("head").appendChild(cssRow);
          }
        });

        client.open("GET", Z4Loader.UP + "js_list.properties", false);
        client.send();
        Array<def.js.String> scripts = new $String(client.responseText).split("\n");
        Z4Loader.loadScripts(scripts, jsFile.substring(0, jsFile.lastIndexOf('?')));
      } else {
        XMLHttpRequest client = new XMLHttpRequest();
        client.open("GET", Z4Loader.UP + "version.properties", false);
        client.send();

        String version = client.responseText;

        HTMLElement cssBundle = document.createElement("link");
        cssBundle.setAttribute("rel", "stylesheet");
        cssBundle.setAttribute("href", Z4Loader.UP + "build/bundle-" + version + ".min.css");
        document.querySelector("head").appendChild(cssBundle);

        HTMLElement scriptBundle = document.createElement("script");
        scriptBundle.setAttribute("src", Z4Loader.UP + "build/bundle-" + version + ".min.js");
        scriptBundle.setAttribute("type", "text/javascript");
        scriptBundle.setAttribute("async", "false");
        scriptBundle.addEventListener("load", (event2) -> Z4Loader.loadScript(jsFile));

        document.querySelector("head").appendChild(scriptBundle);
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
        scriptRow.setAttribute("src", Z4Loader.UP + row);
        scriptRow.setAttribute("type", "text/javascript");
        scriptRow.setAttribute("async", "false");
        scriptRow.addEventListener("load", (event) -> Z4Loader.loadScripts(scripts.slice(1), jsFile));

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
    script.setAttribute("src", jsFile);
    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", "false");
    script.addEventListener("load", (event) -> {
      HTMLElement script2 = document.createElement("script");
      script2.setAttribute("type", "text/javascript");
      script2.innerText = jsFile.replace(".js", "") + ".onLoad();";

      document.querySelector("head").appendChild(script2);
    });

    document.querySelector("head").appendChild(script);
  }

  private Z4Loader() {
  }
}
