package giada.pizzapazza.setting;

import def.dom.XMLHttpRequest;
import def.js.Array;
import giada.pizzapazza.Z4Loader;
import static simulation.js.$Globals.$exists;
import simulation.js.$String;

/**
 * The html factory
 *
 * @author gianpiero.di.blasi
 */
public class Z4HTMLFactory {

  private final static Array<def.js.String> HTML = Z4HTMLFactory.initHTML();

  /**
   * Returns a message
   *
   * @param key The html key
   * @return The html value
   */
  public static String get(String key) {
    return Z4HTMLFactory.HTML.$get(key);
  }

  private static Array<def.js.String> initHTML() {
    Array<def.js.String> array = new Array<>();

    if (Z4Loader.allFiles) {
      XMLHttpRequest client = new XMLHttpRequest();
      client.open("GET", Z4Loader.UP + "html_list.properties", false);
      client.send();

      new $String(client.responseText).split("\n").forEach(row -> {
        if ($exists(row) && !row.startsWith("#")) {
          client.open("GET", Z4Loader.UP + row, false);
          client.send();
          array.$set(row, client.responseText);
        }
      });
    } else {
      XMLHttpRequest client = new XMLHttpRequest();
      client.open("GET", Z4Loader.UP + "version.properties?random=" + Math.random(), false);
      client.send();

      String version = client.responseText;

      client.open("GET", Z4Loader.UP + "build/bundle-" + version + ".html", false);
      client.send();
      Z4HTMLFactory.readHTMLs(array, client.responseText);
    }

    return array;
  }

  private static void readHTMLs(Array<def.js.String> array, String responseText) {
    new $String(responseText).split("\n").forEach(row -> {
      if ($exists(row) && !row.startsWith("#")) {
        Array<def.js.String> keyValue = row.split("=");
        array.$set(keyValue.$get(0).trim(), keyValue.$get(1).trim());
      }
    });
  }

  private Z4HTMLFactory() {
  }
}
