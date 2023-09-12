/**
 * The html factory
 *
 * @author gianpiero.diblasi
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
    let client = new XMLHttpRequest();
    if (Z4Loader.allFiles) {
      client.open("GET", Z4Loader.UP + "src/giada/html_list.properties?random=" + Math.random(), false);
      client.send();
      new String(client.responseText).split("\n").forEach(row => {
        if (row && !row.startsWith("#")) {
          client.open("GET", Z4Loader.UP + "src/" + row, false);
          client.send();
          array[row] = client.responseText;
        }
      });
    } else {
      client.open("GET", Z4Loader.UP + "build/bundle-" + Z4Loader.version + ".html", false);
      client.send();
      Z4HTMLFactory.readHTMLs(array, client.responseText);
    }
    return array;
  }

  static  readHTMLs(array, responseText) {
    new String(responseText).split("\n").forEach(row => {
      if (row) {
        let keyValue = row.split(":=");
        array[keyValue[0].trim()] = keyValue[1].trim();
      }
    });
  }

  constructor() {
  }
}
