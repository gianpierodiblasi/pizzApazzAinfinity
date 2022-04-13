/* global Array, Object, String, URLSearchParams, XMLHttpRequest, Z4MessageFactory, Z4Setting */

/**
 * The message factory
 *
 * @author gianpiero.di.blasi
 */
class Z4MessageFactory {

  static  MESSAGE = Z4MessageFactory.initMessages();

  /**
   * Returns a message
   *
   * @param key The message key
   * @return The message value
   */
  static  get(key) {
    return Z4MessageFactory.MESSAGE[key];
  }

  /**
   * Method to call when the language changes
   */
  static  changingLanguage() {
    Z4MessageFactory.MESSAGE = Z4MessageFactory.initMessages();
    document.querySelectorAll("[data-token-lang-inner_text]").forEach(element => (element).innerText = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text")));
  }

  static  initMessages() {
    let array = new Array();
    let urlParams = new URLSearchParams(window.location.search);
    let path = Z4Loader.UP + (urlParams.get("allFiles") ? "/src/message/" : "/build/message/");
    let file = "message-" + Z4Setting.getLanguage() + ".properties";
    let client = new XMLHttpRequest();
    client.open("GET", path + file, false);
    client.onreadystatechange = (event2) => {
      if (client.readyState === 4 && client.status === 200) {
        Z4MessageFactory.readMessages(array, client.responseText);
      }
      return null;
    };
    client.send();
    if (Object.keys(array).length === 0) {
      Z4Setting.setLanguage("en");
      file = "message-en.properties";
      let clientEN = new XMLHttpRequest();
      clientEN.open("GET", path + file, false);
      clientEN.onreadystatechange = (event2) => {
        if (clientEN.readyState === 4 && clientEN.status === 200) {
          Z4MessageFactory.readMessages(array, clientEN.responseText);
        }
        return null;
      };
      clientEN.send();
    }
    return array;
  }

  static  readMessages(array, responseText) {
    new String(responseText).split("\n").forEach(row => {
      if (row && !row.startsWith("#")) {
        let keyValue = row.split("=");
        array[keyValue[0].trim()] = keyValue[1].trim();
      }
    });
  }

  constructor() {
  }
}
