package giada.pizzapazza.setting;

import def.dom.HTMLElement;
import def.dom.XMLHttpRequest;
import def.js.Array;
import def.js.Object;
import giada.pizzapazza.Z4Loader;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import simulation.js.$String;

/**
 * The message factory
 *
 * @author gianpiero.diblasi
 */
public class Z4MessageFactory {

  private static Array<def.js.String> MESSAGE = Z4MessageFactory.initMessages();

  /**
   * Returns a message
   *
   * @param key The message key
   * @return The message value
   */
  public static String get(String key) {
    return Z4MessageFactory.MESSAGE.$get(key);
  }

  /**
   * Method to call when the language changes
   */
  public static void changingLanguage() {
    Z4MessageFactory.MESSAGE = Z4MessageFactory.initMessages();
    document.querySelectorAll("[data-token-lang-inner_text]").forEach(element -> ((HTMLElement) element).innerHTML = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text")));
  }

  private static Array<def.js.String> initMessages() {
    Array<def.js.String> array = new Array<>();
    String path = Z4Loader.UP + (Z4Loader.allFiles ? "src/message/" : "build/message/");
    String file = Z4Loader.allFiles
            ? "message-" + Z4Setting.getLanguage() + ".txt?random=" + Math.random()
            : "message-" + Z4Setting.getLanguage() + "-" + Z4Loader.version + ".txt";

    XMLHttpRequest client = new XMLHttpRequest();
    client.open("GET", path + file, false);
    client.send();
    Z4MessageFactory.readMessages(array, client.responseText);

    if (Object.keys(array).length == 0) {
      Z4Setting.setLanguage("en");
      file = Z4Loader.allFiles
              ? "message-en.txt?random=" + Math.random()
              : "message-en-" + Z4Loader.version + ".txt";

      XMLHttpRequest clientEN = new XMLHttpRequest();
      clientEN.open("GET", path + file, false);
      clientEN.send();
      Z4MessageFactory.readMessages(array, clientEN.responseText);
    }

    return array;
  }

  private static void readMessages(Array<def.js.String> array, String responseText) {
    new $String(responseText).split("\n").forEach(row -> {
      if ($exists(row) && !row.startsWith("#")) {
        Array<def.js.String> keyValue = row.split("=");
        array.$set(keyValue.$get(0).trim(), keyValue.$get(1).trim());
      }
    });
  }

  private Z4MessageFactory() {
  }
}
