package giada.pizzapazza.setting;

import static def.dom.Globals.window;
import def.dom.XMLHttpRequest;
import def.js.Array;
import def.js.Object;
import static simulation.js.$Globals.$exists;
import simulation.js.$String;
import simulation.js.$URLSearchParams;

/**
 * The message factory
 *
 * @author gianpiero.di.blasi
 */
public class Z4MessageFactory {

  private final static Array<def.js.String> MESSAGE = Z4MessageFactory.initMessages();

  /**
   * Returns a message
   *
   * @param key The message key
   * @return The message value
   */
  public static String get(String key) {
    return Z4MessageFactory.MESSAGE.$get(key);
  }

  private static Array<def.js.String> initMessages() {
    Array<def.js.String> array = new Array<>();
    $URLSearchParams urlParams = new $URLSearchParams(window.location.search);
    String path = urlParams.get("allFiles") ? "/src/message/" : "/build/message/";
    String file = "message-" + Z4Setting.getLanguage() + ".properties";

    XMLHttpRequest client = new XMLHttpRequest();
    client.open("GET", path + file, false);
    client.onreadystatechange = (event2) -> {
      if (client.readyState == 4 && client.status == 200) {
        Z4MessageFactory.readMessages(array, client.responseText);
      }
      return null;
    };
    client.send();

    if (Object.keys(array).length == 0) {
      file = "message-en.properties";

      XMLHttpRequest clientEN = new XMLHttpRequest();
      clientEN.open("GET", path + file, false);
      clientEN.onreadystatechange = (event2) -> {
        if (clientEN.readyState == 4 && clientEN.status == 200) {
          Z4MessageFactory.readMessages(array, clientEN.responseText);
        }
        return null;
      };
      clientEN.send();
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
