/**
 * The html factory
 *
 * @author gianpiero.di.blasi
 */
class Z4HTMLFactory {

  static  HTML = Z4HTMLFactory.initHTML();

  /**
   * Returns a message
   *
   * @param key The html key
   * @return The html value
   */
  static  get(key) {
    return Z4HTMLFactory.HTML[key];
  }

  static  initHTML() {
    let array = new Array();
    if (Z4Loader.allFiles) {
      let client = new XMLHttpRequest();
      client.open("GET", Z4Loader.UP + "html_list.properties", false);
      client.send();
      new String(client.responseText).split("\n").forEach(row => {
        if (row && !row.startsWith("#")) {
          client.open("GET", Z4Loader.UP + row, false);
          client.send();
          array[row] = client.responseText;
        }
      });
    } else {
      let client = new XMLHttpRequest();
      client.open("GET", Z4Loader.UP + "version.properties?random=" + Math.random(), false);
      client.send();
      let version = client.responseText;
      client.open("GET", Z4Loader.UP + "build/bundle-" + version + ".html", false);
      client.send();
      Z4HTMLFactory.readHTMLs(array, client.responseText);
    }
    return array;
  }

  static  readHTMLs(array, responseText) {
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
